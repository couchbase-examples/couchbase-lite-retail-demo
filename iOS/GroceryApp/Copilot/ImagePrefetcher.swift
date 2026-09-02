import Foundation
import CouchbaseLiteSwift

/// Warms the on-disk image cache once, right after the first sync lands.
///
/// Images are the one part of this app that is *not* offline-first. Documents and vectors arrive
/// through replication and live in Couchbase Lite, but product and golden-shelf photos are S3
/// URLs fetched on demand, so a screen that has never been scrolled has never downloaded its
/// pictures. That is invisible in normal use and fatal in a demo: the whole story is going
/// offline and staying useful, and reaching Copilot for the first time in airplane mode would
/// show empty frames — or worse, require switching the network back on mid-narrative.
///
/// So once sync settles, every image URL the app can currently reach is pulled down in the
/// background. Deliberately fire-and-forget: failures are ignored, nothing blocks the UI, and
/// anything already cached is skipped by `ImageDownloadService` itself.
enum ImagePrefetcher {

    /// Bounded concurrency. Serial would take minutes over a conference connection; unbounded
    /// would open ~130 sockets at once and starve the replicator that just finished.
    private static let maxConcurrent = 6

    private static var hasRun = false

    /// Collects every image URL in the local database and downloads it into the disk cache.
    ///
    /// Runs at most once per launch — the guard matters because `onInitialSyncComplete` can fire
    /// again for a second endpoint, and re-walking the collections each time would be wasted
    /// work for no new images.
    static func warmCache(databaseManager: DatabaseManager) {
        guard !hasRun else { return }
        hasRun = true

        Task.detached(priority: .utility) {
            let urls = await collectURLs(databaseManager: databaseManager)
            guard !urls.isEmpty else { return }
            print("🖼️ [Prefetch] warming \(urls.count) images for offline use")

            let started = Date()
            await withTaskGroup(of: Void.self) { group in
                var issued = 0
                for url in urls {
                    if issued >= maxConcurrent { await group.next() }
                    issued += 1
                    group.addTask { _ = await ImageDownloadService.shared.downloadImage(from: url) }
                }
            }
            let elapsed = Date().timeIntervalSince(started)
            print(String(format: "🖼️ [Prefetch] done in %.1fs", elapsed))
        }
    }

    /// Product images plus golden shelf references — the two sets the copilot renders.
    ///
    /// Read on a background context because this walks every inventory and planogram document,
    /// and it is triggered from a replicator callback that should not be held up.
    private static func collectURLs(databaseManager: DatabaseManager) async -> [String] {
        await Task.detached(priority: .utility) { () -> [String] in
            guard let database = await databaseManager.database else { return [] }
            var urls: [String] = []

            // `IS VALUED` filters out documents whose URL is missing or null, so the download
            // queue never contains entries that can only fail.
            let queries = [
                """
                SELECT imageURL FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
                WHERE imageURL IS VALUED
                """,
                """
                SELECT goldenImageURL AS imageURL
                FROM `\(AppConfig.scopeName)`.`\(AppConfig.planogramsCollectionName)`
                WHERE docType = "Planogram" AND goldenImageURL IS VALUED
                """
            ]
            for sql in queries {
                do {
                    for row in try database.createQuery(sql).execute() {
                        if let url = row.string(forKey: "imageURL"), !url.isEmpty {
                            urls.append(url)
                        }
                    }
                } catch {
                    print("⚠️ [Prefetch] URL collection failed: \(error)")
                }
            }
            // The same product image can appear on several documents; downloading it twice is
            // harmless but pointless.
            return Array(Set(urls))
        }.value
    }
}
