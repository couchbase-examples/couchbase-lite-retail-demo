package com.example.groceryapplication.copilot

import android.content.Context

/**
 * BERT WordPiece tokenizer for `all-MiniLM-L6-v2` (bert-base-uncased vocabulary).
 *
 * This is the Kotlin twin of the iOS `WordPieceTokenizer`, and both have to reproduce
 * HuggingFace's `BertTokenizer` exactly. The stored product vectors were authored with the
 * Python tokenizer, so any divergence here shifts query vectors into a slightly different
 * region of the space and degrades ranking in a way that looks like "semantic search is
 * mediocre" rather than like a bug. [CopilotDiagnostics] asserts agreement against
 * known-good token ids for the demo queries.
 *
 * Pipeline, matching `BasicTokenizer` + `WordpieceTokenizer`:
 *   1. clean text (drop control chars, normalize whitespace)
 *   2. pad CJK codepoints so each becomes its own token
 *   3. lowercase and strip accents (NFD, drop combining marks)
 *   4. split on whitespace, then split punctuation into separate tokens
 *   5. greedy longest-match-first subword lookup with `##` continuations
 */
class WordPieceTokenizer private constructor(
    private val vocab: Map<String, Int>
) {
    private val unkId = vocab["[UNK]"] ?: 100
    private val clsId = vocab["[CLS]"] ?: 101
    private val sepId = vocab["[SEP]"] ?: 102
    val padId = vocab["[PAD]"] ?: 0

    val vocabularySize: Int get() = vocab.size

    companion object {
        /** Longest token in bert-base-uncased is 18 chars; bounding the greedy scan keeps
         *  tokenization linear in word length instead of quadratic. */
        private const val MAX_TOKEN_CHARS = 24

        /** HuggingFace drops words longer than this to `[UNK]` before subwording. */
        private const val MAX_CHARS_PER_WORD = 100

        private const val VOCAB_ASSET = "copilot/minilm-vocab.txt"

        @Volatile
        private var instance: WordPieceTokenizer? = null

        /** Loads and caches the tokenizer. The vocabulary is ~230 KB, so it is read once. */
        fun shared(context: Context): WordPieceTokenizer =
            instance ?: synchronized(this) {
                instance ?: load(context).also { instance = it }
            }

        private fun load(context: Context): WordPieceTokenizer {
            val table = HashMap<String, Int>(31_000)
            context.assets.open(VOCAB_ASSET).bufferedReader().useLines { lines ->
                // One token per line, and the line number IS the token id — so blank lines
                // must still consume an index.
                lines.forEachIndexed { index, raw ->
                    table[raw.removeSuffix("\r")] = index
                }
            }
            return WordPieceTokenizer(table)
        }
    }

    data class Encoded(val ids: IntArray, val mask: IntArray)

    /**
     * Encodes text to fixed-length `input_ids` / `attention_mask` arrays.
     *
     * Truncates to [maxLength] including the `[CLS]`/`[SEP]` pair, which is what
     * `truncation=True, padding="max_length"` does on the Python side.
     */
    fun encode(text: String, maxLength: Int): Encoded {
        val ids = ArrayList<Int>(maxLength)
        ids.add(clsId)
        val budget = maxLength - 2      // room for [CLS] and [SEP]

        outer@ for (word in basicTokenize(text)) {
            for (piece in wordPieces(word)) {
                if (ids.size - 1 >= budget) break@outer
                ids.add(piece)
            }
        }
        ids.add(sepId)

        val real = ids.size
        val outIds = IntArray(maxLength) { if (it < real) ids[it] else padId }
        val outMask = IntArray(maxLength) { if (it < real) 1 else 0 }
        return Encoded(outIds, outMask)
    }

    /** Token ids without padding — used by the diagnostics parity check. */
    fun tokenIds(text: String, maxLength: Int): List<Int> {
        val encoded = encode(text, maxLength)
        return encoded.ids.take(encoded.mask.sum())
    }

    // MARK: - Basic tokenization

    /** Whitespace + punctuation splitting, lowercasing and accent stripping. */
    fun basicTokenize(text: String): List<String> {
        val cleaned = StringBuilder(text.length)
        var index = 0
        while (index < text.length) {
            val cp = text.codePointAt(index)
            index += Character.charCount(cp)
            when {
                // Drop NUL and the replacement char outright.
                cp == 0 || cp == 0xFFFD -> Unit
                isWhitespace(cp) -> cleaned.append(' ')
                isControl(cp) -> Unit
                // Surround CJK codepoints with spaces so each becomes its own token.
                isCJK(cp) -> cleaned.append(' ').appendCodePoint(cp).append(' ')
                else -> cleaned.appendCodePoint(cp)
            }
        }

        val out = ArrayList<String>()
        for (chunk in cleaned.toString().split(' ')) {
            if (chunk.isEmpty()) continue
            // Lowercase then strip combining marks — the order matters for locales where
            // casing changes which marks are produced. Locale.ROOT so a Turkish device
            // does not turn "I" into a dotless ı and silently change tokenization.
            val lowered = chunk.lowercase(java.util.Locale.ROOT)
            val decomposed = java.text.Normalizer.normalize(lowered, java.text.Normalizer.Form.NFD)
            val stripped = StringBuilder(decomposed.length)
            var j = 0
            while (j < decomposed.length) {
                val cp = decomposed.codePointAt(j)
                j += Character.charCount(cp)
                if (!isCombiningMark(cp)) stripped.appendCodePoint(cp)
            }
            out.addAll(splitPunctuation(stripped.toString()))
        }
        return out
    }

    private fun splitPunctuation(text: String): List<String> {
        val out = ArrayList<String>()
        val current = StringBuilder()
        var i = 0
        while (i < text.length) {
            val cp = text.codePointAt(i)
            i += Character.charCount(cp)
            if (isPunctuation(cp)) {
                if (current.isNotEmpty()) {
                    out.add(current.toString())
                    current.setLength(0)
                }
                out.add(String(Character.toChars(cp)))
            } else {
                current.appendCodePoint(cp)
            }
        }
        if (current.isNotEmpty()) out.add(current.toString())
        return out
    }

    // MARK: - WordPiece

    /**
     * Greedy longest-match-first subwording. Emits `[UNK]` for the whole word if any
     * position cannot be matched, matching HuggingFace rather than emitting partial pieces.
     */
    fun wordPieces(word: String): List<Int> {
        if (word.isEmpty()) return emptyList()
        val chars = word.toCharArray()
        if (chars.size > MAX_CHARS_PER_WORD) return listOf(unkId)

        val pieces = ArrayList<Int>()
        var start = 0
        while (start < chars.size) {
            var end = minOf(chars.size, start + MAX_TOKEN_CHARS)
            var matched: Int? = null
            while (end > start) {
                val candidate = StringBuilder().apply {
                    if (start > 0) append("##")
                    append(chars, start, end - start)
                }.toString()
                val id = vocab[candidate]
                if (id != null) {
                    matched = id
                    break
                }
                end -= 1
            }
            val id = matched ?: return listOf(unkId)
            pieces.add(id)
            start = end
        }
        return pieces
    }

    // MARK: - Character classes (mirroring HuggingFace's helpers)

    private fun isWhitespace(cp: Int): Boolean {
        if (cp == ' '.code || cp == '\t'.code || cp == '\n'.code || cp == '\r'.code) return true
        return Character.getType(cp) == Character.SPACE_SEPARATOR.toInt()
    }

    private fun isControl(cp: Int): Boolean {
        if (cp == '\t'.code || cp == '\n'.code || cp == '\r'.code) return false
        return when (Character.getType(cp).toByte()) {
            Character.CONTROL, Character.FORMAT, Character.PRIVATE_USE,
            Character.SURROGATE, Character.UNASSIGNED -> true
            else -> false
        }
    }

    private fun isCombiningMark(cp: Int): Boolean = when (Character.getType(cp).toByte()) {
        Character.NON_SPACING_MARK, Character.COMBINING_SPACING_MARK,
        Character.ENCLOSING_MARK -> true
        else -> false
    }

    /**
     * HuggingFace treats all ASCII non-alphanumerics as punctuation, not just the Unicode
     * punctuation categories — so `$`, `+`, `^` and friends split too.
     */
    private fun isPunctuation(cp: Int): Boolean {
        if (cp in 33..47 || cp in 58..64 || cp in 91..96 || cp in 123..126) return true
        return when (Character.getType(cp).toByte()) {
            Character.CONNECTOR_PUNCTUATION, Character.DASH_PUNCTUATION,
            Character.START_PUNCTUATION, Character.END_PUNCTUATION,
            Character.INITIAL_QUOTE_PUNCTUATION, Character.FINAL_QUOTE_PUNCTUATION,
            Character.OTHER_PUNCTUATION -> true
            else -> false
        }
    }

    private fun isCJK(cp: Int): Boolean =
        cp in 0x4E00..0x9FFF || cp in 0x3400..0x4DBF || cp in 0x20000..0x2A6DF ||
        cp in 0x2A700..0x2B73F || cp in 0x2B740..0x2B81F || cp in 0x2B820..0x2CEAF ||
        cp in 0xF900..0xFAFF || cp in 0x2F800..0x2FA1F
}
