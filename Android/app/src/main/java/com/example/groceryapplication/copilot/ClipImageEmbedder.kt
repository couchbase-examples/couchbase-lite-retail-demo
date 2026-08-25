package com.example.groceryapplication.copilot

import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.DatabaseManager

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.Context
import android.graphics.Bitmap
import android.util.Log
import java.nio.FloatBuffer

/**
 * On-device CLIP ViT-B/32 image embedding for Step 2 (planogram audit) — Kotlin
 * counterpart of the iOS ImageEmbedder. Runs clip-vit-b-32.onnx via ONNX Runtime
 * Mobile. The graph bakes in CLIP mean/std normalization + L2 norm, so the app
 * only needs to feed a 224x224 RGB image scaled to [0,1] in CHW order. Output
 * "embedding" is a 512-d vector — same model/preprocessing as the golden cell
 * vectors, so APPROX_VECTOR_DISTANCE is apples-to-apples.
 *
 * Bundle in app/src/main/assets/:  clip-vit-b-32.onnx  (from export_clip_onnx.py)
 */
object ClipImageEmbedder {
    private const val MODEL_ASSET = "clip-vit-b-32.onnx"
    private const val SIZE = 224

    private var env: OrtEnvironment? = null
    private var session: OrtSession? = null

    @Volatile var isReady = false
        private set
    var status = "not loaded"
        private set

    /**
     * Call once at startup (e.g. from GroceryApplication.onCreate). Safe to call repeatedly.
     *
     * The model is staged to a file and handed to ONNX Runtime as a path, NOT read into a
     * ByteArray. The graph is ~335MB and Android caps this app's heap at ~192MB, so
     * `assets.open().readBytes()` cannot succeed on any device — it threw OutOfMemoryError
     * before the session was ever created. Passing a path lets ORT read the weights natively,
     * outside the Java heap.
     *
     * Errors are caught as Throwable rather than Exception on purpose: OutOfMemoryError and
     * UnsatisfiedLinkError are Errors, so an `Exception` catch let them escape and kill the
     * calling thread — which, from a startup thread, took the whole app down. Failing to load
     * the model must degrade this screen, never crash the app.
     */
    fun init(context: Context) {
        if (isReady) return
        synchronized(this) {
            if (isReady) return
            try {
                val model = stagedModel(context)
                env = OrtEnvironment.getEnvironment()
                session = env!!.createSession(model.absolutePath, OrtSession.SessionOptions())
                isReady = true
                status = "ready"
                Log.d("ClipImageEmbedder", "✅ ready (${model.length() / 1_048_576} MB)")
            } catch (t: Throwable) {
                status = "load failed: ${t.message}"
                Log.e("ClipImageEmbedder", "❌ $status", t)
            }
        }
    }

    /**
     * Copies the model out of assets on first use and returns the on-disk file.
     *
     * Streamed in chunks so peak memory stays at the buffer size rather than the file size.
     * Reused on later launches when the existing copy is complete — the size check is what
     * makes a half-written file from an interrupted first run recover instead of loading a
     * truncated graph.
     */
    private fun stagedModel(context: Context): java.io.File {
        val target = java.io.File(context.noBackupFilesDir, MODEL_ASSET)
        if (target.exists() && target.length() > 0) return target

        // Written to a .part file and renamed only on success, so an interrupted first launch
        // leaves no truncated model that a later run would happily load.
        //
        // Note we deliberately do NOT size-check against the asset: assets.openFd() throws for
        // compressed entries ("can not be opened as a file descriptor"), and aapt compresses
        // this one. The atomic rename is what guarantees a complete file instead.
        val tmp = java.io.File(context.noBackupFilesDir, "$MODEL_ASSET.part")
        if (tmp.exists()) tmp.delete()
        context.assets.open(MODEL_ASSET).use { input ->
            tmp.outputStream().use { output -> input.copyTo(output, 1 shl 20) }
        }
        if (!tmp.renameTo(target)) {
            tmp.delete()
            throw java.io.IOException("could not stage $MODEL_ASSET")
        }
        Log.d("ClipImageEmbedder", "staged model → ${target.absolutePath} (${target.length()} B)")
        return target
    }

    /** Embed a bitmap into a 512-d CLIP vector, or null if not ready. */
    fun embed(bitmap: Bitmap): FloatArray? {
        val ort = env ?: return null
        val sess = session ?: return null
        return try {
            val scaled = Bitmap.createScaledBitmap(bitmap, SIZE, SIZE, true)
            val pixels = IntArray(SIZE * SIZE)
            scaled.getPixels(pixels, 0, SIZE, 0, 0, SIZE, SIZE)
            // CHW, RGB, [0,1]
            val chw = FloatArray(3 * SIZE * SIZE)
            val plane = SIZE * SIZE
            for (i in pixels.indices) {
                val p = pixels[i]
                chw[i] = ((p shr 16) and 0xFF) / 255f            // R
                chw[plane + i] = ((p shr 8) and 0xFF) / 255f      // G
                chw[2 * plane + i] = (p and 0xFF) / 255f          // B
            }
            OnnxTensor.createTensor(ort, FloatBuffer.wrap(chw), longArrayOf(1, 3, SIZE.toLong(), SIZE.toLong())).use { t ->
                sess.run(mapOf("image" to t)).use { results ->
                    @Suppress("UNCHECKED_CAST")
                    val out = results[0].value as Array<FloatArray>
                    out[0].copyOf()
                }
            }
        } catch (e: Exception) {
            Log.e("ClipImageEmbedder", "❌ inference failed", e)
            null
        }
    }

    /** Crop a normalized sub-rect (0..1) — used to tile the shelf photo into cells. */
    fun crop(src: Bitmap, left: Float, top: Float, width: Float, height: Float): Bitmap {
        val x = (left * src.width).toInt().coerceIn(0, src.width - 1)
        val y = (top * src.height).toInt().coerceIn(0, src.height - 1)
        val w = (width * src.width).toInt().coerceIn(1, src.width - x)
        val h = (height * src.height).toInt().coerceIn(1, src.height - y)
        return Bitmap.createBitmap(src, x, y, w, h)
    }
}
