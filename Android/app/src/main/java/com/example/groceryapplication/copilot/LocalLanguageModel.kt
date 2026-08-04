package com.example.groceryapplication.copilot

import android.content.Context
import android.util.Log
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import java.io.File

/**
 * On-device answer generation for Step 3, via MediaPipe LLM Inference.
 *
 * The Android counterpart of Apple Foundation Models on iOS, and it has the same shape: retrieval
 * always works, generation is availability-gated, and when generation is unavailable the retrieved
 * sources are still shown rather than an invented answer.
 *
 * **The model is deliberately not bundled.** A 4-bit Gemma `.task` file is 0.5–1.5GB depending on
 * the variant, which would dwarf the APK, and the weights are licence-gated so they cannot be
 * redistributed in this repo anyway. Instead the file is side-loaded to app-external storage:
 *
 * ```
 * adb push <model>.task /sdcard/Android/data/com.example.groceryapplication/files/llm/
 * ```
 *
 * Any `.task` file in that directory is picked up, so Gemma 2-2B, Gemma 3-1B or Gemma 3-270M all
 * work without a code change — which matters because the size/quality trade-off is a demo
 * decision, not an engineering one. On a mid-range phone the 1B variants answer in a couple of
 * seconds; 2B is noticeably slower but writes better prose.
 */
object LocalLanguageModel {

    private const val TAG = "LocalLLM"
    private const val MODEL_DIR = "llm"

    /**
     * Total context, prompt included — not a response budget. The grounded prompt runs 700-900
     * tokens with four retrieved chunks, so 1024 left almost nothing for the answer and produced
     * fragments. Matched to the ekv2048 model variant.
     */
    private const val MAX_TOKENS = 2048
    private const val TOP_K = 40
    private const val TEMPERATURE = 0.4f

    sealed interface Availability {
        data object Ready : Availability
        /** Generation cannot run, and this is the reason to show. */
        data class RetrievalOnly(val reason: String) : Availability
    }

    @Volatile
    private var inference: LlmInference? = null
    @Volatile
    private var loadedPath: String? = null

    /**
     * Directory the model is expected in, surfaced so the UI can name it exactly.
     *
     * Created here, by the app, on purpose. If `adb shell mkdir` gets there first the directory
     * ends up owned by `shell` with mode `drwxrws---`, and the app cannot list its own
     * subdirectory — the model is present, readable by adb, and invisible to the app. Creating
     * it from inside the app means it is app-owned, and adb can still push into it.
     */
    fun modelDirectory(context: Context): File =
        File(context.getExternalFilesDir(null), MODEL_DIR).apply {
            if (!exists()) mkdirs()
        }

    /**
     * Finds the model, tolerating either layout: inside `llm/`, or dropped straight into the
     * app's external files root. The second is worth accepting because it is the directory adb
     * can always write to, so it is what people reach for when a push into the subdirectory
     * fails.
     */
    private fun modelFile(context: Context): File? {
        val isTask = { f: File -> f.isFile && f.name.endsWith(".task") }
        val candidates = buildList {
            modelDirectory(context).listFiles()?.filter(isTask)?.let { addAll(it) }
            context.getExternalFilesDir(null)?.listFiles()?.filter(isTask)?.let { addAll(it) }
        }
        return candidates.maxByOrNull { it.length() }
    }

    /** Name of the model in use, for the behind-the-scenes screen. */
    fun modelName(context: Context): String? = modelFile(context)?.name

    fun availability(context: Context): Availability {
        val file = modelFile(context)
            ?: return Availability.RetrievalOnly(
                "No on-device language model installed, so the retrieved sources are shown as-is " +
                    "— the retrieval half of RAG. Add a Gemma .task file to " +
                    "${modelDirectory(context).absolutePath} to enable generated answers."
            )
        if (file.length() < 50L * 1024 * 1024) {
            return Availability.RetrievalOnly(
                "The model file ${file.name} looks truncated (${file.length() / 1_000_000}MB). " +
                    "Re-push it and try again."
            )
        }
        return Availability.Ready
    }

    /**
     * Loads the model, reusing the existing instance when the file has not changed.
     *
     * First load is slow — hundreds of milliseconds to several seconds depending on variant and
     * backend — so it happens on the caller's background thread, never on the main thread.
     */
    private fun ensureLoaded(context: Context): LlmInference? {
        val file = modelFile(context) ?: return null
        inference?.let { if (loadedPath == file.absolutePath) return it }

        return try {
            close()
            val options = LlmInference.LlmInferenceOptions.builder()
                .setModelPath(file.absolutePath)
                .setMaxTokens(MAX_TOKENS)
                .setMaxTopK(TOP_K)
                .build()
            LlmInference.createFromOptions(context, options).also {
                inference = it
                loadedPath = file.absolutePath
                Log.i(TAG, "🧠 loaded ${file.name} (${file.length() / 1_000_000}MB)")
            }
        } catch (e: Throwable) {
            // Throwable, not Exception: a missing or mismatched native backend surfaces as
            // UnsatisfiedLinkError, and that should degrade to retrieval-only rather than crash.
            Log.e(TAG, "❌ failed to load model", e)
            null
        }
    }

    /**
     * Generates a grounded answer, or null when generation is unavailable.
     *
     * Blocking — call from a background dispatcher.
     */
    fun generate(context: Context, prompt: String): String? {
        val llm = ensureLoaded(context) ?: return null
        return try {
            llm.generateResponse(prompt)?.let(::tidy)?.takeIf { it.isNotEmpty() }
        } catch (e: Throwable) {
            Log.e(TAG, "❌ generation failed", e)
            null
        }
    }

    /**
     * Cleans up generation artefacts before display. Gemma emits markdown emphasis and
     * occasionally echoes a turn marker, neither of which means anything in a plain Text view —
     * `**20-40g of protein**` renders with the asterisks visible.
     */
    private fun tidy(raw: String): String = raw
        .replace("<end_of_turn>", "")
        .replace("<start_of_turn>", "")
        .replace(Regex("\\*{1,2}"), "")
        .trim()

    fun close() {
        try {
            inference?.close()
        } catch (_: Throwable) {
        }
        inference = null
        loadedPath = null
    }

    /**
     * Builds the grounded prompt.
     *
     * Same grounding rules as iOS, and for the same reason: an invented nutrition figure in a
     * retail demo is worse than "I don't know". Kept here so the diagnostics screen can show
     * exactly what the model was given.
     */
    fun buildPrompt(
        question: String,
        chunks: List<KnowledgeHit>,
        product: GroceryItemContext? = null
    ): String = buildString {
        // Gemma's instruction-tuned turn markers. Without them the model treats the prompt as
        // text to continue rather than a question to answer, and returns a fragment that looks
        // like a truncation bug — the first run here came back as `20-40g of protein."`, which
        // is Gemma completing the last source it was shown.
        append("<start_of_turn>user\n")
        append(
            "You are a retail store associate's assistant. Answer only from the SOURCES below. " +
                "If the sources do not contain the answer, say so plainly instead of guessing. " +
                "Be concise — two or three sentences, spoken aloud to a shopper standing in the " +
                "aisle. Do not invent nutrition figures, prices, or product claims. Never " +
                "mention that you were given sources.\n\n"
        )
        product?.let {
            append("PRODUCT IN QUESTION:\n${it.describe()}\n\n")
        }
        append("SOURCES:\n")
        chunks.forEachIndexed { index, chunk ->
            append("[${index + 1}] ${chunk.title}\n${chunk.chunkText}\n\n")
        }
        append("QUESTION: $question")
        append("<end_of_turn>\n<start_of_turn>model\n")
    }

    /** The few product fields worth putting in the prompt. */
    data class GroceryItemContext(
        val name: String,
        val brand: String?,
        val description: String?,
        val badges: List<String>
    ) {
        fun describe(): String = buildList {
            add("$name by ${brand ?: "unknown brand"}")
            description?.let { add(it) }
            if (badges.isNotEmpty()) add("Attributes: " + badges.joinToString(", "))
        }.joinToString("\n")
    }
}
