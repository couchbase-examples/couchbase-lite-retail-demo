import Foundation
import CoreML

/// On-device text embedding with `all-MiniLM-L6-v2` (384-d, cosine, unit-norm).
///
/// This is the live edge inference in the copilot: product vectors ship pre-computed
/// in the synced documents, but every query the associate types or speaks is embedded
/// here, on the device, with no network call.
///
/// Mean pooling and L2 normalization are baked into the CoreML graph, so the output is
/// directly comparable to the vectors authored offline from the same weights — there is
/// no pooling implementation on this side that could drift from the Python one.
actor TextEmbedder {

    enum EmbedderError: Error, LocalizedError {
        case modelMissing
        case badOutput

        var errorDescription: String? {
            switch self {
            case .modelMissing:
                return "MiniLMTextEncoder.mlmodelc is missing from the app bundle."
            case .badOutput:
                return "The embedding model returned an unexpected output shape."
            }
        }
    }

    static let shared = TextEmbedder()

    /// Must match `SEQ_LEN` in the conversion script — the CoreML model has a fixed
    /// input shape, so a mismatch is a hard failure rather than a quality regression.
    static let sequenceLength = 128
    static let dimensions = 384
    static let modelName = "all-MiniLM-L6-v2"
    static let metric = "cosine"

    private var model: MLModel?
    private var tokenizer: WordPieceTokenizer?

    /// Wall-clock of the most recent embed call, surfaced on the behind-the-scenes screen.
    private(set) var lastEmbedMilliseconds: Double = 0
    /// Which compute units CoreML actually loaded with, for the same screen.
    private(set) var computeUnitsDescription = "not loaded"

    /// Loads the model and vocabulary. Safe to call repeatedly; the work happens once.
    func prepare() throws {
        if model != nil && tokenizer != nil { return }

        if tokenizer == nil {
            tokenizer = try WordPieceTokenizer()
        }

        if model == nil {
            // Xcode compiles the bundled .mlpackage to .mlmodelc at build time.
            guard let url = Bundle.main.url(forResource: "MiniLMTextEncoder",
                                            withExtension: "mlmodelc") else {
                throw EmbedderError.modelMissing
            }
            let config = MLModelConfiguration()
            // .all lets CoreML place the transformer on the Neural Engine where the
            // hardware has one, and fall back to GPU/CPU (notably the Simulator)
            // without any code change.
            config.computeUnits = .all
            model = try MLModel(contentsOf: url, configuration: config)
            computeUnitsDescription = "Neural Engine / GPU / CPU (.all)"
        }
    }

    /// Embeds one string into a 384-d unit-norm vector.
    func embed(_ text: String) throws -> [Float] {
        try prepare()
        guard let model, let tokenizer else { throw EmbedderError.modelMissing }

        let started = DispatchTime.now().uptimeNanoseconds
        let encoded = tokenizer.encode(text, maxLength: Self.sequenceLength)

        let shape = [1, NSNumber(value: Self.sequenceLength)] as [NSNumber]
        let ids = try MLMultiArray(shape: shape, dataType: .int32)
        let mask = try MLMultiArray(shape: shape, dataType: .int32)
        for i in 0..<Self.sequenceLength {
            ids[i] = NSNumber(value: encoded.ids[i])
            mask[i] = NSNumber(value: encoded.mask[i])
        }

        let input = try MLDictionaryFeatureProvider(dictionary: [
            "input_ids": MLFeatureValue(multiArray: ids),
            "attention_mask": MLFeatureValue(multiArray: mask),
        ])

        let output = try model.prediction(from: input)
        guard let array = output.featureValue(for: "embedding")?.multiArrayValue,
              array.count == Self.dimensions else {
            throw EmbedderError.badOutput
        }

        var vector = [Float](repeating: 0, count: Self.dimensions)
        for i in 0..<Self.dimensions {
            vector[i] = array[i].floatValue
        }

        lastEmbedMilliseconds =
            Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000
        return vector
    }

    /// Token ids for a string — used by the diagnostics screen to show the tokenization
    /// the model actually saw, and by the parity self-check.
    func tokenIds(for text: String) throws -> [Int32] {
        try prepare()
        guard let tokenizer else { throw EmbedderError.modelMissing }
        let encoded = tokenizer.encode(text, maxLength: Self.sequenceLength)
        return Array(encoded.ids.prefix(Int(encoded.mask.reduce(0, +))))
    }

    var vocabularySize: Int { tokenizer?.vocabularySize ?? 0 }
}
