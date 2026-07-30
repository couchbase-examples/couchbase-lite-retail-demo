package com.example.groceryapplication.copilot

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.Context
import android.util.Log
import java.nio.LongBuffer

/**
 * On-device text embedding with `all-MiniLM-L6-v2` (384-d, cosine, unit-norm).
 *
 * The Android counterpart to iOS's CoreML `TextEmbedder`, and the live edge inference in the
 * copilot: product vectors ship pre-computed in the synced documents, but every query the
 * associate types is embedded here, on the device, with no network call.
 *
 * Mean pooling and L2 normalization are baked into the ONNX graph, exactly as they are in the
 * CoreML export, so neither platform has pooling code that could drift from the offline job.
 *
 * The bundled model is int8-quantized (22 MB rather than 86 MB). Verified over 14 queries,
 * quantization never changed which product ranked first; it does shift distances up by about
 * 0.02 versus the fp32 reference, so the same query can read a slightly larger distance here
 * than on iOS. Ranking — which is what the demo turns on — is unaffected.
 */
class TextEmbedder private constructor(
    private val session: OrtSession,
    private val tokenizer: WordPieceTokenizer
) {
    /** Wall-clock of the most recent embed call, surfaced on the behind-the-scenes screen. */
    @Volatile
    var lastEmbedMillis: Double = 0.0
        private set

    val vocabularySize: Int get() = tokenizer.vocabularySize

    companion object {
        private const val TAG = "TextEmbedder"
        private const val MODEL_ASSET = "copilot/minilm_l6_v2_int8.onnx"

        /** Must match SEQ_LEN in the export script and iOS — the graph has a fixed shape. */
        const val SEQUENCE_LENGTH = 128
        const val DIMENSIONS = 384
        const val MODEL_NAME = "all-MiniLM-L6-v2"
        const val METRIC = "cosine"
        const val RUNTIME = "ONNX Runtime, int8 weights"

        @Volatile
        private var instance: TextEmbedder? = null

        /**
         * Loads and caches the embedder. Reads the model out of assets into a byte array
         * because ONNX Runtime cannot mmap directly from an APK asset.
         */
        fun shared(context: Context): TextEmbedder =
            instance ?: synchronized(this) {
                instance ?: build(context).also { instance = it }
            }

        private fun build(context: Context): TextEmbedder {
            val bytes = context.assets.open(MODEL_ASSET).use { it.readBytes() }
            val options = OrtSession.SessionOptions().apply {
                // The catalogue is ~100 vectors and queries are one at a time, so a single
                // thread is plenty and avoids spinning up a pool per query.
                setIntraOpNumThreads(2)
                setOptimizationLevel(OrtSession.SessionOptions.OptLevel.ALL_OPT)
            }
            val session = OrtEnvironment.getEnvironment().createSession(bytes, options)
            Log.i(TAG, "loaded $MODEL_ASSET (${bytes.size / (1024 * 1024)} MB)")
            return TextEmbedder(session, WordPieceTokenizer.shared(context))
        }
    }

    /** Embeds one string into a 384-d unit-norm vector. */
    fun embed(text: String): FloatArray {
        val started = System.nanoTime()
        val encoded = tokenizer.encode(text, SEQUENCE_LENGTH)

        val shape = longArrayOf(1, SEQUENCE_LENGTH.toLong())
        val env = OrtEnvironment.getEnvironment()

        // The exported graph takes int64 ids, which is the ONNX default for embedding
        // lookups; CoreML on iOS takes int32. Same values either way.
        val idBuffer = LongBuffer.allocate(SEQUENCE_LENGTH)
        val maskBuffer = LongBuffer.allocate(SEQUENCE_LENGTH)
        for (i in 0 until SEQUENCE_LENGTH) {
            idBuffer.put(encoded.ids[i].toLong())
            maskBuffer.put(encoded.mask[i].toLong())
        }
        idBuffer.rewind()
        maskBuffer.rewind()

        OnnxTensor.createTensor(env, idBuffer, shape).use { ids ->
            OnnxTensor.createTensor(env, maskBuffer, shape).use { mask ->
                session.run(mapOf("input_ids" to ids, "attention_mask" to mask)).use { result ->
                    @Suppress("UNCHECKED_CAST")
                    val raw = result[0].value as Array<FloatArray>
                    val vector = raw[0].copyOf()
                    require(vector.size == DIMENSIONS) {
                        "expected $DIMENSIONS dimensions, got ${vector.size}"
                    }
                    lastEmbedMillis = (System.nanoTime() - started) / 1_000_000.0
                    return vector
                }
            }
        }
    }

    /**
     * Token ids for a string — used by the diagnostics screen to show the tokenization the
     * model actually saw, and by the parity self-check.
     */
    fun tokenIds(text: String): List<Int> = tokenizer.tokenIds(text, SEQUENCE_LENGTH)
}

/**
 * Self-checks that catch the failure modes which otherwise present as "search quality is
 * mediocre" instead of as an error.
 */
object CopilotDiagnostics {

    /**
     * Token ids produced by HuggingFace `BertTokenizer` for these exact strings, captured
     * during the offline embedding run — the same probes the iOS check uses. If the Kotlin
     * tokenizer disagrees, query vectors land somewhere other than the stored product
     * vectors and ranking silently degrades.
     */
    private val expectations = listOf(
        // [CLS] high protein shake low sugar dairy free [SEP] — the hero query
        "high protein shake low sugar dairy free" to
            listOf(101, 2152, 5250, 6073, 2659, 5699, 11825, 2489, 102),
        // "electrolytes" splits into electro ##ly ##tes — a three-piece subword chain, so
        // this catches greedy-longest-match bugs a two-piece word would not.
        "a drink with electrolytes for after a workout" to
            listOf(101, 1037, 4392, 2007, 16175, 2135, 4570, 2005, 2044, 1037, 27090, 102),
        // [CLS] dairy - free [SEP] — exercises punctuation splitting
        "dairy-free" to listOf(101, 11825, 1011, 2489, 102),
    )

    fun runTokenizerParityCheck(context: Context): String {
        val failures = mutableListOf<String>()
        val embedder = try {
            TextEmbedder.shared(context)
        } catch (e: Exception) {
            return "FAIL — embedder unavailable: ${e.message}"
        }

        for ((text, expected) in expectations) {
            val got = embedder.tokenIds(text)
            if (got != expected) {
                failures += "MISMATCH ${text.take(28)}\n  expected $expected\n  got      $got"
            }
        }

        // The ONNX graph L2-normalizes, so a non-unit norm means the wrong output tensor is
        // being read or pooling was lost in the export.
        try {
            val vector = embedder.embed("high protein shake")
            val norm = kotlin.math.sqrt(vector.fold(0.0) { acc, v -> acc + v * v })
            if (kotlin.math.abs(norm - 1.0) > 0.01) {
                failures += "MISMATCH vector norm: expected 1.000, got %.4f".format(norm)
            }
            if (vector.size != TextEmbedder.DIMENSIONS) {
                failures += "MISMATCH dimensions: expected ${TextEmbedder.DIMENSIONS}, " +
                    "got ${vector.size}"
            }
        } catch (e: Exception) {
            return "FAIL — embedding failed: ${e.message}"
        }

        return if (failures.isEmpty()) {
            "PASS — tokenizer matches the offline job on ${expectations.size} probes; " +
                "output is ${TextEmbedder.DIMENSIONS}-d and unit-norm."
        } else {
            "FAIL\n" + failures.joinToString("\n")
        }
    }
}
