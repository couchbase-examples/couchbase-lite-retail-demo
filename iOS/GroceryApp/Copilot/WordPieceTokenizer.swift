import Foundation

/// BERT WordPiece tokenizer for `all-MiniLM-L6-v2` (bert-base-uncased vocabulary).
///
/// This has to reproduce HuggingFace's `BertTokenizer` behaviour exactly. The stored
/// product vectors were authored with the Python tokenizer, so any divergence here
/// silently shifts query vectors into a slightly different region of the space and
/// degrades ranking in a way that looks like "semantic search is mediocre" rather
/// than like a bug. `CopilotDiagnostics` asserts agreement against known-good token
/// ids for the demo queries.
///
/// Pipeline, matching `BasicTokenizer` + `WordpieceTokenizer`:
///   1. clean text (drop control chars, normalize whitespace)
///   2. pad CJK codepoints so each becomes its own token
///   3. lowercase and strip accents (NFD, drop combining marks)
///   4. split on whitespace, then split punctuation into separate tokens
///   5. greedy longest-match-first subword lookup with `##` continuations
final class WordPieceTokenizer {

    enum TokenizerError: Error, LocalizedError {
        case vocabularyMissing(String)

        var errorDescription: String? {
            switch self {
            case .vocabularyMissing(let name):
                return "Tokenizer vocabulary '\(name)' is missing from the app bundle."
            }
        }
    }

    private let vocab: [String: Int32]
    private let unkId: Int32
    private let clsId: Int32
    private let sepId: Int32
    let padId: Int32
    /// Longest token in bert-base-uncased is 18 chars; bounding the greedy scan keeps
    /// tokenization linear in word length instead of quadratic.
    private let maxTokenChars = 24
    /// HuggingFace drops words longer than this to `[UNK]` before subwording.
    private let maxCharsPerWord = 100

    init(vocabularyResource: String = "minilm-vocab", bundle: Bundle = .main) throws {
        guard let url = bundle.url(forResource: vocabularyResource, withExtension: "txt"),
              let raw = try? String(contentsOf: url, encoding: .utf8) else {
            throw TokenizerError.vocabularyMissing(vocabularyResource)
        }

        // One token per line, and the line number IS the token id — so blank lines
        // must still consume an index. Only a trailing newline is dropped.
        var lines = raw.split(separator: "\n", omittingEmptySubsequences: false)
        if lines.last?.isEmpty == true { lines.removeLast() }

        var table: [String: Int32] = [:]
        table.reserveCapacity(lines.count)
        for (index, line) in lines.enumerated() {
            let token = line.hasSuffix("\r") ? String(line.dropLast()) : String(line)
            table[token] = Int32(index)
        }

        self.vocab = table
        self.unkId = table["[UNK]"] ?? 100
        self.clsId = table["[CLS]"] ?? 101
        self.sepId = table["[SEP]"] ?? 102
        self.padId = table["[PAD]"] ?? 0
    }

    var vocabularySize: Int { vocab.count }

    /// Encodes text to fixed-length `input_ids` / `attention_mask` arrays.
    ///
    /// Truncates to `maxLength` including the `[CLS]`/`[SEP]` pair, which is what
    /// `truncation=True, padding="max_length"` does on the Python side.
    func encode(_ text: String, maxLength: Int) -> (ids: [Int32], mask: [Int32]) {
        var ids: [Int32] = [clsId]
        let budget = maxLength - 2      // room for [CLS] and [SEP]

        outer: for word in basicTokenize(text) {
            for piece in wordPieces(word) {
                if ids.count - 1 >= budget { break outer }
                ids.append(piece)
            }
        }
        ids.append(sepId)

        var mask = [Int32](repeating: 1, count: ids.count)
        if ids.count < maxLength {
            let padCount = maxLength - ids.count
            ids.append(contentsOf: [Int32](repeating: padId, count: padCount))
            mask.append(contentsOf: [Int32](repeating: 0, count: padCount))
        }
        return (ids, mask)
    }

    // MARK: - Basic tokenization

    /// Whitespace + punctuation splitting, lowercasing and accent stripping.
    func basicTokenize(_ text: String) -> [String] {
        var cleaned = String(String.UnicodeScalarView(text.unicodeScalars.compactMap { scalar in
            // Drop NUL and the replacement char outright; map every other control
            // character and separator to a plain space.
            if scalar.value == 0 || scalar.value == 0xFFFD { return nil }
            if isWhitespace(scalar) { return " " }
            if isControl(scalar) { return nil }
            return scalar
        }))

        // Surround CJK codepoints with spaces so each becomes its own token.
        if cleaned.unicodeScalars.contains(where: isCJK) {
            var padded = String.UnicodeScalarView()
            for scalar in cleaned.unicodeScalars {
                if isCJK(scalar) {
                    padded.append(" ")
                    padded.append(scalar)
                    padded.append(" ")
                } else {
                    padded.append(scalar)
                }
            }
            cleaned = String(padded)
        }

        var out: [String] = []
        for chunk in cleaned.split(separator: " ", omittingEmptySubsequences: true) {
            // Lowercase then strip combining marks — the order matters for locales
            // where casing changes which marks are produced.
            let lowered = chunk.lowercased()
            let stripped = String(String.UnicodeScalarView(
                lowered.decomposedStringWithCanonicalMapping.unicodeScalars.filter {
                    !isCombiningMark($0)
                }
            ))
            out.append(contentsOf: splitPunctuation(stripped))
        }
        return out
    }

    private func splitPunctuation(_ text: String) -> [String] {
        var out: [String] = []
        var current = String.UnicodeScalarView()
        for scalar in text.unicodeScalars {
            if isPunctuation(scalar) {
                if !current.isEmpty {
                    out.append(String(current))
                    current = String.UnicodeScalarView()
                }
                out.append(String(scalar))
            } else {
                current.append(scalar)
            }
        }
        if !current.isEmpty { out.append(String(current)) }
        return out
    }

    // MARK: - WordPiece

    /// Greedy longest-match-first subwording. Emits `[UNK]` for the whole word if any
    /// position cannot be matched, matching HuggingFace rather than emitting partial
    /// pieces.
    func wordPieces(_ word: String) -> [Int32] {
        let chars = Array(word)
        if chars.isEmpty { return [] }
        if chars.count > maxCharsPerWord { return [unkId] }

        var pieces: [Int32] = []
        var start = 0
        while start < chars.count {
            var end = min(chars.count, start + maxTokenChars)
            var matched: Int32?
            while end > start {
                var candidate = String(chars[start..<end])
                if start > 0 { candidate = "##" + candidate }
                if let id = vocab[candidate] {
                    matched = id
                    break
                }
                end -= 1
            }
            guard let id = matched else { return [unkId] }
            pieces.append(id)
            start = end
        }
        return pieces
    }

    // MARK: - Character classes (mirroring HuggingFace's helpers)

    private func isWhitespace(_ s: Unicode.Scalar) -> Bool {
        if s == " " || s == "\t" || s == "\n" || s == "\r" { return true }
        return s.properties.generalCategory == .spaceSeparator
    }

    private func isControl(_ s: Unicode.Scalar) -> Bool {
        if s == "\t" || s == "\n" || s == "\r" { return false }
        switch s.properties.generalCategory {
        case .control, .format, .privateUse, .surrogate, .unassigned: return true
        default: return false
        }
    }

    private func isCombiningMark(_ s: Unicode.Scalar) -> Bool {
        switch s.properties.generalCategory {
        case .nonspacingMark, .spacingMark, .enclosingMark: return true
        default: return false
        }
    }

    /// HuggingFace treats all ASCII non-alphanumerics as punctuation, not just the
    /// Unicode punctuation categories — so `$`, `+`, `^` and friends split too.
    private func isPunctuation(_ s: Unicode.Scalar) -> Bool {
        let v = s.value
        if (v >= 33 && v <= 47) || (v >= 58 && v <= 64)
            || (v >= 91 && v <= 96) || (v >= 123 && v <= 126) { return true }
        switch s.properties.generalCategory {
        case .connectorPunctuation, .dashPunctuation, .openPunctuation,
             .closePunctuation, .initialPunctuation, .finalPunctuation,
             .otherPunctuation:
            return true
        default:
            return false
        }
    }

    private func isCJK(_ s: Unicode.Scalar) -> Bool {
        let v = s.value
        return (0x4E00...0x9FFF).contains(v) || (0x3400...0x4DBF).contains(v)
            || (0x20000...0x2A6DF).contains(v) || (0x2A700...0x2B73F).contains(v)
            || (0x2B740...0x2B81F).contains(v) || (0x2B820...0x2CEAF).contains(v)
            || (0xF900...0xFAFF).contains(v) || (0x2F800...0x2FA1F).contains(v)
    }
}
