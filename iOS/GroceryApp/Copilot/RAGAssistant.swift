import Foundation

#if canImport(FoundationModels)
import FoundationModels
#endif

/// Generation backend for the on-device RAG assistant.
///
/// Apple's Foundation Models framework is used where available: the model already ships with
/// the OS, so there is no multi-gigabyte first-run download, no download manager, no storage
/// checks, and no risk of being killed by the per-app memory limit alongside Couchbase Lite
/// and two CoreML encoders. Streaming comes for free.
///
/// It is gated at runtime rather than by raising the app's deployment target. Availability
/// has to be checked anyway — Apple Intelligence can be unsupported by the hardware, switched
/// off by the user, or still downloading its assets — so raising the target to iOS 26 would
/// not have removed this code, it would only have made the whole reference app iOS 26+.
///
/// When generation is unavailable the assistant degrades to retrieval-only: the retrieved
/// knowledge chunks are still shown, which is the honest half of RAG and still demonstrates
/// the vector search. It never silently invents an answer.
enum RAGBackend {

    enum Availability: Equatable {
        case ready
        /// Retrieval works, generation does not, and this is why.
        case retrievalOnly(reason: String)

        var canGenerate: Bool { self == .ready }
    }

    static var availability: Availability {
        #if canImport(FoundationModels)
        if #available(iOS 26.0, macCatalyst 26.0, *) {
            switch SystemLanguageModel.default.availability {
            case .available:
                return .ready
            case .unavailable(.deviceNotEligible):
                return .retrievalOnly(
                    reason: "This device does not support Apple Intelligence, so answers "
                          + "cannot be generated on-device. Retrieved sources are shown instead.")
            case .unavailable(.appleIntelligenceNotEnabled):
                return .retrievalOnly(
                    reason: "Apple Intelligence is turned off. Enable it in Settings to have "
                          + "the copilot write an answer from the retrieved sources.")
            case .unavailable(.modelNotReady):
                return .retrievalOnly(
                    reason: "The on-device model is still downloading. Retrieved sources are "
                          + "shown; try again shortly.")
            case .unavailable:
                return .retrievalOnly(
                    reason: "The on-device language model is unavailable right now. Retrieved "
                          + "sources are shown instead.")
            }
        }
        return .retrievalOnly(
            reason: "On-device generation needs iOS 26 or later. Retrieved sources are shown, "
                  + "which is the retrieval half of RAG.")
        #else
        return .retrievalOnly(
            reason: "This build has no on-device language model. Retrieved sources are shown.")
        #endif
    }

    static var backendDescription: String {
        #if canImport(FoundationModels)
        if #available(iOS 26.0, macCatalyst 26.0, *) {
            return availability.canGenerate
                ? "Apple Foundation Models (on-device)"
                : "Apple Foundation Models (unavailable)"
        }
        #endif
        return "none — retrieval only"
    }

    /// Grounding rules. The point of RAG here is that the answer comes from the store's own
    /// knowledge collection, so the model is told plainly not to go beyond it — an invented
    /// nutrition claim in a retail demo is worse than "I don't know".
    private static let instructions = """
        You are a retail store associate's assistant. Answer only from the SOURCES provided \
        in the prompt. If the sources do not contain the answer, say so plainly instead of \
        guessing. Be concise — two or three sentences, spoken aloud to a shopper standing in \
        the aisle. Do not invent nutrition figures, prices, or product claims. Never mention \
        that you were given sources.
        """

    /// Builds the grounded prompt. Kept here so the diagnostics screen can show exactly what
    /// was sent to the model.
    static func buildPrompt(question: String, chunks: [KnowledgeHit],
                            product: GroceryItem?) -> String {
        var prompt = ""
        if let product {
            var facts = ["\(product.name) by \(product.brand ?? "unknown brand")"]
            if let description = product.description { facts.append(description) }
            if let badges = product.attributes?.displayBadges, !badges.isEmpty {
                facts.append("Attributes: " + badges.joined(separator: ", "))
            }
            prompt += "PRODUCT IN QUESTION:\n" + facts.joined(separator: "\n") + "\n\n"
        }
        prompt += "SOURCES:\n"
        for (index, chunk) in chunks.enumerated() {
            prompt += "[\(index + 1)] \(chunk.title)\n\(chunk.chunkText)\n\n"
        }
        prompt += "QUESTION: \(question)"
        return prompt
    }

    /// Streams an answer, yielding the cumulative text so the UI can render it as it arrives.
    /// A multi-second silent pause reads as a hang on stage; streaming reads as thinking.
    static func streamAnswer(question: String, chunks: [KnowledgeHit],
                             product: GroceryItem?) -> AsyncThrowingStream<String, Error> {
        let prompt = buildPrompt(question: question, chunks: chunks, product: product)

        #if canImport(FoundationModels)
        if #available(iOS 26.0, macCatalyst 26.0, *), availability.canGenerate {
            return AsyncThrowingStream { continuation in
                let task = Task {
                    do {
                        let session = LanguageModelSession(instructions: instructions)
                        let stream = session.streamResponse(to: prompt)
                        for try await partial in stream {
                            continuation.yield(partial.content)
                        }
                        continuation.finish()
                    } catch {
                        continuation.finish(throwing: error)
                    }
                }
                continuation.onTermination = { _ in task.cancel() }
            }
        }
        #endif

        return AsyncThrowingStream { continuation in
            continuation.finish(throwing: RAGError.generationUnavailable)
        }
    }

    enum RAGError: Error, LocalizedError {
        case generationUnavailable

        var errorDescription: String? {
            "On-device answer generation is not available; showing the retrieved sources."
        }
    }

    /// Turns a generation failure into something a viewer can act on.
    ///
    /// The case worth calling out: on the **Simulator**, `SystemLanguageModel.availability`
    /// reports `.available` on iOS 26 — the OS supports the framework — but inference then
    /// fails with `LanguageModelSession.GenerationError -1`, because the Simulator does not
    /// ship the Apple Intelligence model assets. Availability is therefore not a reliable
    /// pre-flight check, and the honest message is "this needs real hardware", not the raw
    /// error. Retrieval is unaffected, so the sources stay on screen either way.
    static func explain(generationError error: Error) -> String {
        let description = String(describing: error)
        let isMissingAssets = description.contains("FoundationModels")
            || description.contains("GenerationError")

        if isMissingAssets {
            return "Retrieval worked and the sources below are what a grounded answer would be "
                 + "written from. Generating that answer needs a physical device with Apple "
                 + "Intelligence enabled — the Simulator reports the model as available but "
                 + "does not ship its assets, so inference fails."
        }
        return "Could not generate an answer: \(error.localizedDescription). The retrieved "
             + "sources are shown below."
    }
}
