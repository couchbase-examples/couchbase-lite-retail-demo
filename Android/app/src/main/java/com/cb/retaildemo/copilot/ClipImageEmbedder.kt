package com.cb.retaildemo.copilot

import com.cb.retaildemo.AppConfig
import com.cb.retaildemo.DatabaseManager

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.Context
import android.graphics.Bitmap
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.nio.FloatBuffer
import java.security.MessageDigest
import java.util.concurrent.atomic.AtomicBoolean

/**
 * On-device CLIP ViT-B/32 image embedding for Step 2 (planogram audit) — Kotlin
 * counterpart of the iOS ImageEmbedder. Runs clip-vit-b-32.onnx via ONNX Runtime
 * Mobile. The graph bakes in CLIP mean/std normalization + L2 norm, so the app
 * only needs to feed a 224x224 RGB image scaled to [0,1] in CHW order. Output
 * "embedding" is a 512-d vector — same model/preprocessing as the golden cell
 * vectors, so APPROX_VECTOR_DISTANCE is apples-to-apples.
 *
 * The model is downloaded on demand (see [startDownload]), not bundled in the APK.
 */
object ClipImageEmbedder {
    private const val MODEL_NAME = AppConfig.CLIP_MODEL_NAME
    private const val SIZE = 224

    private var env: OrtEnvironment? = null
    private var session: OrtSession? = null

    @Volatile var isReady = false
        private set
    var status = "not loaded"
        private set

    private val downloadScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val downloading = AtomicBoolean(false)

    /** Non-null while a download is in flight. Snapshot state, so the UI can observe it. */
    var downloadProgress by mutableStateOf<LocalLanguageModel.DownloadProgress?>(null)
        private set

    /** Last download failure, cleared when a new attempt starts. */
    var downloadError by mutableStateOf<String?>(null)
        private set

    /** Bumped whenever the model becomes ready, so observers re-check [isDownloaded]. */
    var readyGeneration by mutableStateOf(0)
        private set

    private fun modelFile(context: Context) = File(context.noBackupFilesDir, MODEL_NAME)

    /** True once a complete, verified model is on disk. */
    fun isDownloaded(context: Context): Boolean =
        modelFile(context).let { it.exists() && it.length() == AppConfig.CLIP_MODEL_BYTES }

    /**
     * Loads the model if it has been downloaded. Safe to call repeatedly, and a no-op when the
     * model is not on disk yet (status says so).
     *
     * The file is handed to ONNX Runtime as a path, NOT read into a ByteArray: the graph is
     * ~335MB and Android caps this app's heap at ~192MB, so reading it into memory throws
     * OutOfMemoryError. A path lets ORT read the weights natively, outside the Java heap.
     *
     * Errors are caught as Throwable on purpose: OutOfMemoryError and UnsatisfiedLinkError are
     * Errors, and letting them escape a startup thread would take the whole app down. Failing
     * to load the model must degrade the Planogram screen, never crash the app.
     */
    fun init(context: Context) {
        if (isReady) return
        synchronized(this) {
            if (isReady) return
            if (!isDownloaded(context)) {
                status = "not downloaded"
                return
            }
            try {
                val model = modelFile(context)
                val environment = OrtEnvironment.getEnvironment()
                env = environment
                session = environment.createSession(model.absolutePath, OrtSession.SessionOptions())
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
     * Starts the model download if one is not already running, and returns immediately. Owned
     * by this object rather than a composable so leaving the Planogram tab does not cancel it.
     * Loads the model as soon as the download is verified.
     */
    fun startDownload(context: Context) {
        if (!downloading.compareAndSet(false, true)) return
        val appContext = context.applicationContext
        downloadError = null
        downloadProgress = LocalLanguageModel.DownloadProgress(0, 0)
        downloadScope.launch {
            val result = download(appContext) { downloadProgress = it }
            downloadProgress = null
            downloading.set(false)
            result.fold(
                onSuccess = { init(appContext); readyGeneration += 1 },
                onFailure = { t ->
                    downloadError = "Download failed: ${t.message ?: "unknown error"}. " +
                        "Check your connection and try again."
                }
            )
        }
    }

    /**
     * Downloads to `<name>.part`, resuming a partial file, verifies the MD5, and renames into
     * place only when complete, so an interrupted run never leaves a truncated model that
     * [isDownloaded] would accept. Blocking; call from an IO dispatcher.
     */
    private fun download(
        context: Context,
        onProgress: (LocalLanguageModel.DownloadProgress) -> Unit
    ): Result<File> {
        val target = modelFile(context)
        val part = File(context.noBackupFilesDir, "$MODEL_NAME.part")
        return try {
            if (part.exists() && part.length() >= AppConfig.CLIP_MODEL_BYTES) part.delete()
            var existing = if (part.exists()) part.length() else 0L
            val connection = (URL(AppConfig.CLIP_MODEL_URL).openConnection() as HttpURLConnection)
                .apply {
                    connectTimeout = 30_000
                    readTimeout = 60_000
                    if (existing > 0) setRequestProperty("Range", "bytes=$existing-")
                }
            connection.connect()
            // 206 means the server honoured the range; otherwise start over rather than append
            // a full body onto the bytes already on disk.
            val resuming = connection.responseCode == 206
            if (existing > 0 && !resuming) {
                part.delete()
                existing = 0L
            }
            val total = AppConfig.CLIP_MODEL_BYTES

            connection.inputStream.use { input ->
                FileOutputStream(part, resuming).use { output ->
                    val buffer = ByteArray(1 shl 16)
                    var written = existing
                    var lastReported = 0L
                    while (true) {
                        val read = input.read(buffer)
                        if (read < 0) break
                        output.write(buffer, 0, read)
                        written += read
                        if (written - lastReported > 4L * 1024 * 1024) {
                            lastReported = written
                            onProgress(LocalLanguageModel.DownloadProgress(written, total))
                        }
                    }
                    onProgress(LocalLanguageModel.DownloadProgress(written, total))
                }
            }
            connection.disconnect()

            if (part.length() != total) {
                return Result.failure(
                    IOException("incomplete download: ${part.length()} of $total bytes")
                )
            }
            val digest = MessageDigest.getInstance("MD5")
            part.inputStream().use { input ->
                val buffer = ByteArray(1 shl 20)
                while (true) {
                    val read = input.read(buffer)
                    if (read < 0) break
                    digest.update(buffer, 0, read)
                }
            }
            val actual = digest.digest().joinToString("") { "%02x".format(it) }
            if (!actual.equals(AppConfig.CLIP_MODEL_MD5, ignoreCase = true)) {
                part.delete()
                return Result.failure(
                    IOException("the downloaded file was corrupt (checksum mismatch) and was " +
                        "discarded, so tapping download again will start clean")
                )
            }
            if (target.exists()) target.delete()
            if (!part.renameTo(target)) {
                return Result.failure(IOException("could not move model into place"))
            }
            Log.d("ClipImageEmbedder", "⬇️ downloaded ${target.name} (${target.length()} B)")
            Result.success(target)
        } catch (t: Throwable) {
            Log.e("ClipImageEmbedder", "❌ model download failed", t)
            Result.failure(t)
        }
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
