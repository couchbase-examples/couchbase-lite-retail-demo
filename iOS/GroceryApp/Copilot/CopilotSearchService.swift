import Foundation
import CouchbaseLiteSwift

/// A product returned by semantic search, with the distance that ranked it.
struct SemanticHit: Identifiable, Hashable {
    let item: GroceryItem
    /// Cosine distance: 0 is identical, 2 is opposite. Lower is better.
    let distance: Double

    var id: String { item.id ?? UUID().uuidString }

    /// Human-friendly confidence for the UI. Cosine distance on unit vectors maps
    /// linearly onto similarity, which reads far better on screen than a raw distance.
    var similarityPercent: Int { Int(((1.0 - distance / 2.0) * 100).rounded()) }

    static func == (lhs: SemanticHit, rhs: SemanticHit) -> Bool {
        lhs.id == rhs.id && lhs.distance == rhs.distance
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
        hasher.combine(distance)
    }
}

/// A retrieved knowledge chunk for the RAG step.
struct KnowledgeHit: Identifiable, Hashable {
    let id: String
    let title: String
    let chunkText: String
    let sourceDoc: String
    let distance: Double
}

/// What the last search actually did, for the behind-the-scenes screen.
struct SearchTelemetry {
    var queryText: String = ""
    var inputMode: String = "text"
    var embedMilliseconds: Double = 0
    var searchMilliseconds: Double = 0
    var candidatesReturned: Int = 0
    var resultsAfterThreshold: Int = 0
    var keywordResultCount: Int = 0
    var tokenCount: Int = 0
    var vectorPreview: [Float] = []
}

/// Runs the copilot's searches against Couchbase Lite.
///
/// Step 1 is a pure `APPROX_VECTOR_DISTANCE` query over the local `inventory` collection,
/// using a query vector embedded on-device a few milliseconds earlier. The same call also
/// runs the app's existing keyword `LIKE` search so the UI can show, side by side, what a
/// non-semantic search would have returned — which is the whole point being demonstrated.
@MainActor
final class CopilotSearchService: ObservableObject {

    @Published private(set) var telemetry = SearchTelemetry()

    private let databaseManager: DatabaseManager
    private let embedder = TextEmbedder.shared

    /// `APPROX_VECTOR_DISTANCE`'s third argument is the distance metric, and it defaults
    /// to `euclidean2` — not to the metric the index was built with. Omitting it (as the
    /// data-model spec's example queries do) fails at query time with
    /// "euclidean2 does not match the index's metric, cosine".
    private static let metricArgument = "\"cosine\""

    init(databaseManager: DatabaseManager) {
        self.databaseManager = databaseManager
    }

    // MARK: - Step 1: semantic product search

    /// Embeds `query` on-device and returns the nearest inventory items.
    ///
    /// - Parameters:
    ///   - threshold: cosine-distance ceiling; results above it are dropped as irrelevant.
    ///   - category: optional metadata filter, exercising the hybrid vector + `WHERE` path.
    ///   - inStockOnly: second hybrid predicate.
    func search(query: String,
                threshold: Double = AppConfig.defaultRelevanceThreshold,
                category: String? = nil,
                inStockOnly: Bool = false,
                inputMode: String = "text") async throws -> [SemanticHit] {

        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return [] }
        guard let database = databaseManager.database else { return [] }

        // ---- on-device query embedding (the live edge inference) ----
        let vector = try await embedder.embed(trimmed)
        let embedMs = await embedder.lastEmbedMilliseconds
        let tokens = try await embedder.tokenIds(for: trimmed)

        // ---- local vector search ----
        let distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.text.vector, $queryVector, \(Self.metricArgument))"

        var predicates = ["\(distanceExpr) IS VALUED"]
        if let category, !category.isEmpty {
            predicates.append("category = $category")
        }
        if inStockOnly {
            predicates.append("stockQty > 0")
        }

        // `IS VALUED` is the documented way to force the vector index to be used.
        // Distance is aliased once and ordered by the alias so the expensive function
        // is not re-evaluated per row in ORDER BY.
        let sql = """
            SELECT META().id AS id, name, category, price, imageURL, stockQty,
                   productId, sku, brand, unit, location, attributes,
                   description, searchTags, storeId, docType,
                   \(distanceExpr) AS distance
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE \(predicates.joined(separator: "\n              AND "))
            ORDER BY distance
            LIMIT \(AppConfig.copilotSearchLimit)
            """

        let started = DispatchTime.now().uptimeNanoseconds
        let cblQuery = try database.createQuery(sql)
        let params = Parameters()
        // Fleece stores the authored vectors as doubles, so the query vector is passed
        // as doubles too — matching representations keeps the distances exact.
        params.setValue(vector.map { Double($0) }, forName: "queryVector")
        if let category, !category.isEmpty {
            params.setValue(category, forName: "category")
        }
        cblQuery.parameters = params

        var candidates: [SemanticHit] = []
        for row in try cblQuery.execute() {
            guard let id = row.string(forKey: "id"),
                  let item = GroceryItem.from(row, id: id) else { continue }
            candidates.append(SemanticHit(item: item, distance: row.double(forKey: "distance")))
        }
        let searchMs = Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000

        let relevant = candidates.filter { $0.distance <= threshold }
        let keywordCount = keywordSearch(query: trimmed).count

        telemetry = SearchTelemetry(
            queryText: trimmed,
            inputMode: inputMode,
            embedMilliseconds: embedMs,
            searchMilliseconds: searchMs,
            candidatesReturned: candidates.count,
            resultsAfterThreshold: relevant.count,
            keywordResultCount: keywordCount,
            tokenCount: tokens.count,
            vectorPreview: Array(vector.prefix(8))
        )

        return relevant
    }

    // MARK: - The keyword baseline

    /// Reproduces the app's existing inventory search — substring `LIKE` over name and
    /// category — so the copilot can show what the associate would have gotten without
    /// vector search. Not a strawman: it is literally `DatabaseManager.searchGrocery`'s
    /// predicate, run over the same catalogue.
    func keywordSearch(query: String) -> [GroceryItem] {
        guard let database = databaseManager.database else { return [] }
        let terms = query.lowercased()
            .split(whereSeparator: { !$0.isLetter && !$0.isNumber })
            .filter { $0.count > 2 }
            .map(String.init)
        guard !terms.isEmpty else { return [] }

        let clauses = terms.enumerated().map { i, _ in
            "LOWER(name) LIKE $t\(i) OR LOWER(category) LIKE $t\(i)"
        }
        let sql = """
            SELECT META().id AS id, name, category, price, imageURL, stockQty,
                   productId, sku, brand, unit, location, attributes, storeId, docType
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE \(clauses.map { "(\($0))" }.joined(separator: " OR "))
            ORDER BY name
            """
        do {
            let cblQuery = try database.createQuery(sql)
            let params = Parameters()
            for (i, term) in terms.enumerated() {
                params.setValue("%\(term)%", forName: "t\(i)")
            }
            cblQuery.parameters = params
            return try cblQuery.execute().compactMap { row in
                guard let id = row.string(forKey: "id") else { return nil }
                return GroceryItem.from(row, id: id)
            }
        } catch {
            print("❌ [Copilot] keyword search failed: \(error)")
            return []
        }
    }

    // MARK: - Step 3: RAG retrieval

    /// Retrieves the top knowledge chunks for a question, optionally scoped to the
    /// category of the product being discussed (the hybrid retrieval path from §8.2).
    func retrieveKnowledge(question: String,
                           relatedCategory: String? = nil,
                           limit: Int = AppConfig.copilotRAGChunkCount) async throws -> [KnowledgeHit] {
        guard let database = databaseManager.database else { return [] }
        let trimmed = question.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return [] }

        let vector = try await embedder.embed(trimmed)

        let distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.text.vector, $queryVector, \(Self.metricArgument))"

        var predicates = ["\(distanceExpr) IS VALUED"]
        if relatedCategory != nil {
            predicates.append("ARRAY_CONTAINS(relatedCategories, $category)")
        }

        let sql = """
            SELECT META().id AS id, title, chunkText, sourceDoc,
                   \(distanceExpr) AS distance
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.knowledgeCollectionName)`
            WHERE \(predicates.joined(separator: " AND "))
            ORDER BY distance
            LIMIT \(limit)
            """

        let cblQuery = try database.createQuery(sql)
        let params = Parameters()
        params.setValue(vector.map { Double($0) }, forName: "queryVector")
        if let relatedCategory {
            params.setValue(relatedCategory, forName: "category")
        }
        cblQuery.parameters = params

        var hits: [KnowledgeHit] = []
        for row in try cblQuery.execute() {
            guard let id = row.string(forKey: "id") else { continue }
            hits.append(KnowledgeHit(
                id: id,
                title: row.string(forKey: "title") ?? "",
                chunkText: row.string(forKey: "chunkText") ?? "",
                sourceDoc: row.string(forKey: "sourceDoc") ?? "",
                distance: row.double(forKey: "distance")
            ))
        }

        // A category-scoped query can legitimately come back empty — the ANN candidate
        // set is gathered before the metadata predicate is applied, so a restrictive
        // filter can eliminate every candidate. Retrying unscoped keeps retrieval useful
        // instead of handing the model an empty context.
        if hits.isEmpty && relatedCategory != nil {
            return try await retrieveKnowledge(question: trimmed, relatedCategory: nil, limit: limit)
        }
        return hits
    }

    /// Reads the embedding envelope of a specific document, for the provenance panel.
    func embeddingMetadata(forDocumentId docId: String) -> GroceryItem.Embedding.Vector? {
        guard let database = databaseManager.database,
              let collection = try? database.collection(name: AppConfig.collectionName,
                                                        scope: AppConfig.scopeName),
              let doc = try? collection.document(id: docId) else { return nil }
        return GroceryItem.embeddingMetadata(from: doc)
    }
}
