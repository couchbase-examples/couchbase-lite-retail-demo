package com.example.groceryapplication.copilot

import android.content.Context
import android.util.Log
import coil.imageLoader
import coil.request.CachePolicy
import coil.request.ImageRequest
import com.couchbase.lite.Database
import com.example.groceryapplication.AppConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.coroutineScope
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Warms Coil's disk cache once, right after the first sync lands.
 *
 * Images are the one part of this app that is *not* offline-first. Documents and vectors arrive
 * through replication and live in Couchbase Lite, but product and golden-shelf photos are S3
 * URLs fetched on demand, so a screen that has never been scrolled has never downloaded its
 * pictures. That is invisible in normal use and fatal in a demo: the whole story is going
 * offline and staying useful, and reaching Copilot for the first time in airplane mode would
 * show empty frames — or worse, require switching the network back on mid-narrative.
 *
 * Requests go through the app's own Coil `imageLoader`, so what lands here is exactly what
 * `AsyncImage` reads later. Fire-and-forget: failures are ignored and nothing blocks the UI.
 *
 * Kotlin counterpart of iOS `ImagePrefetcher.swift`.
 */
object ImagePrefetcher {

    private const val TAG = "ImagePrefetch"

    /** Bounded concurrency: serial is too slow over conference wifi, unbounded would open ~130
     *  sockets at once and starve the replicator that just finished. */
    private const val MAX_CONCURRENT = 6

    private val hasRun = AtomicBoolean(false)
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    /**
     * Collects every image URL in the local database and pulls it into the disk cache.
     *
     * Runs at most once per launch — `onInitialSyncComplete` can fire again for a second
     * endpoint, and re-walking the collections would be wasted work for no new images.
     */
    fun warmCache(context: Context, database: Database?) {
        if (database == null) return
        if (!hasRun.compareAndSet(false, true)) return

        val appContext = context.applicationContext
        scope.launch {
            val urls = collectUrls(database)
            if (urls.isEmpty()) return@launch
            Log.i(TAG, "🖼️ warming ${urls.size} images for offline use")

            val started = System.currentTimeMillis()
            val gate = Semaphore(MAX_CONCURRENT)
            coroutineScope {
                urls.forEach { url ->
                    launch {
                        gate.withPermit {
                            val request = ImageRequest.Builder(appContext)
                                .data(url)
                                // Write to disk, skip the memory cache: this is about surviving
                                // a later cold render offline, not about being resident now.
                                .diskCachePolicy(CachePolicy.ENABLED)
                                .memoryCachePolicy(CachePolicy.DISABLED)
                                .build()
                            runCatching { appContext.imageLoader.execute(request) }
                        }
                    }
                }
            }
            Log.i(TAG, "🖼️ done in ${System.currentTimeMillis() - started} ms")
        }
    }

    /** Product images plus golden shelf references — the two sets the copilot renders. */
    private fun collectUrls(database: Database): List<String> {
        val urls = mutableListOf<String>()
        // `IS VALUED` filters out documents whose URL is missing or null, so the download queue
        // never contains entries that can only fail.
        val queries = listOf(
            """
            SELECT imageURL FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
            WHERE imageURL IS VALUED
            """.trimIndent(),
            """
            SELECT goldenImageURL AS imageURL
            FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
            WHERE docType = "Planogram" AND goldenImageURL IS VALUED
            """.trimIndent()
        )
        queries.forEach { sql ->
            try {
                database.createQuery(sql).execute().forEach { row ->
                    row.getString("imageURL")?.takeIf { it.isNotEmpty() }?.let { urls += it }
                }
            } catch (t: Throwable) {
                Log.w(TAG, "⚠️ URL collection failed", t)
            }
        }
        // The same product image can appear on several documents; downloading it twice is
        // harmless but pointless.
        return urls.distinct()
    }
}
