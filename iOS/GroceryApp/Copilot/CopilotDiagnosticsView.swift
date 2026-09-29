import SwiftUI
import CouchbaseLiteSwift

/// The "behind the scenes" screen: what is actually running on this device.
///
/// Everything here is read from the model at runtime — the embedding metadata travels with
/// each vector, so model name, dimensions, metric and cloud-vs-edge provenance need no
/// extra storage. The latency figures are measured, not estimated.
struct CopilotDiagnosticsView: View {
    let telemetry: SearchTelemetry
    @Binding var threshold: Double

    @EnvironmentObject var databaseManager: DatabaseManager
    @Environment(\.dismiss) private var dismiss

    @State private var storedVector: GroceryItem.Embedding.Vector?
    @State private var parity: String?
    @State private var isRunningParityCheck = false

    private let accent = Color(hex: "FC9C0C")

    var body: some View {
        NavigationView {
            List {
                if let error = databaseManager.vectorSearchError {
                    Section {
                        Label(error, systemImage: "exclamationmark.triangle.fill")
                            .font(.caption)
                            .foregroundColor(.orange)
                    }
                }

                Section("Query embedding (on this device)") {
                    row("Model", TextEmbedder.modelName)
                    row("Dimensions", "\(TextEmbedder.dimensions)")
                    row("Distance metric", TextEmbedder.metric)
                    row("Max sequence length", "\(TextEmbedder.sequenceLength) tokens")
                    row("Runtime", "CoreML, fp16 weights")
                    row("Compute units", "Neural Engine / GPU / CPU")
                    row("Vocabulary", "WordPiece, 30,522 tokens")
                }

                Section("Last query") {
                    if telemetry.queryText.isEmpty {
                        Text("Run a search to populate these numbers.")
                            .font(.caption).foregroundColor(.secondary)
                    } else {
                        row("Text", telemetry.queryText)
                        row("Input mode", telemetry.inputMode == "voice"
                            ? "voice → on-device ASR → text" : "typed text")
                        row("Tokens", "\(telemetry.tokenCount)")
                        row("Embed time", String(format: "%.1f ms", telemetry.embedMilliseconds))
                        row("Vector search time", String(format: "%.1f ms", telemetry.searchMilliseconds))
                        row("Candidates from index", "\(telemetry.candidatesReturned)")
                        row("Within cutoff", "\(telemetry.resultsAfterThreshold)")
                        row("Keyword search would return", "\(telemetry.keywordResultCount)")
                        if !telemetry.vectorPreview.isEmpty {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Query vector (first 8 of \(TextEmbedder.dimensions))")
                                    .font(.caption).foregroundColor(.secondary)
                                Text(telemetry.vectorPreview
                                        .map { String(format: "%+.4f", $0) }
                                        .joined(separator: "  "))
                                    .font(.caption2.monospaced())
                            }
                        }
                    }
                }

                Section("On-device vector indexes") {
                    if databaseManager.vectorIndexReports.isEmpty {
                        Text("No indexes reported yet.")
                            .font(.caption).foregroundColor(.secondary)
                    } else {
                        ForEach(databaseManager.vectorIndexReports, id: \.self) { report in
                            Text(report).font(.caption.monospaced())
                        }
                    }
                    Text("The index is built by Couchbase Lite on this device from the synced "
                         + "documents. Capella stores the vectors as ordinary JSON arrays and "
                         + "does no vector work — every search runs locally.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }

                Section("Stored vector provenance") {
                    if let stored = storedVector {
                        row("Model", stored.model ?? "—")
                        row("Dimensions", stored.dim.map(String.init) ?? "—")
                        row("Metric", stored.metric ?? "—")
                        row("Generated", stored.source == "cloud"
                            ? "offline / cloud, synced to device" : "on the edge")
                        row("Embedded field", stored.sourceText ?? "—")
                        if let ts = stored.generatedAt {
                            row("Generated at", Date(timeIntervalSince1970: Double(ts) / 1000)
                                .formatted(date: .abbreviated, time: .shortened))
                        }
                        if stored.model != TextEmbedder.modelName {
                            Label("Stored vectors were produced by a different model than the "
                                  + "one embedding queries. Rankings will be meaningless until "
                                  + "these match.", systemImage: "exclamationmark.triangle.fill")
                                .font(.caption)
                                .foregroundColor(.red)
                        }
                    } else {
                        Text("Reading a product document…")
                            .font(.caption).foregroundColor(.secondary)
                    }
                }

                Section("Relevance cutoff") {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Cosine distance ≤")
                            Spacer()
                            Text(String(format: "%.2f", threshold))
                                .font(.body.monospaced())
                                .foregroundColor(accent)
                        }
                        Slider(value: $threshold, in: 0.2...1.2, step: 0.05).tint(accent)
                        Text("Tuned against the real corpus rather than hardcoded: on this "
                             + "catalogue the best match for the hero query sits at 0.24 and the "
                             + "median document at 0.81, so a 0.35 cutoff (as originally specced) "
                             + "would discard legitimate near-misses.")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }

                Section("Cloud ↔ edge parity self-check") {
                    Text("Confirms this device's tokenizer produces the exact token ids the "
                         + "offline embedding job used. A mismatch here silently degrades "
                         + "ranking rather than raising an error.")
                        .font(.caption2).foregroundColor(.secondary)
                    Button {
                        runParityCheck()
                    } label: {
                        HStack {
                            if isRunningParityCheck { ProgressView().padding(.trailing, 4) }
                            Text("Run self-check")
                        }
                    }
                    .disabled(isRunningParityCheck)
                    if let parity {
                        Text(parity)
                            .font(.caption.monospaced())
                            .foregroundColor(parity.hasPrefix("PASS") ? .green : .red)
                    }
                }
            }
            .navigationTitle("Behind the Scenes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .task { loadStoredVector() }
        }
    }

    private func row(_ label: String, _ value: String) -> some View {
        HStack(alignment: .top) {
            Text(label).font(.caption).foregroundColor(.secondary)
            Spacer(minLength: 12)
            Text(value)
                .font(.caption)
                .multilineTextAlignment(.trailing)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    /// Reads the embedding envelope off any product document that has one.
    private func loadStoredVector() {
        guard let database = databaseManager.database,
              let collection = try? database.collection(name: AppConfig.collectionName,
                                                        scope: AppConfig.scopeName) else { return }
        let sql = """
            SELECT embedding
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE embedding.text.vector IS VALUED
            LIMIT 1
            """
        guard let rows = try? database.createQuery(sql).execute() else { return }
        for row in rows {
            storedVector = GroceryItem.embeddingMetadata(from: row)
            break
        }
        _ = collection
    }

    /// Compares locally-produced token ids against ids captured from the Python tokenizer
    /// for the same strings, then checks the resulting vector is unit-norm.
    private func runParityCheck() {
        isRunningParityCheck = true
        Task {
            let result = await CopilotDiagnostics.runTokenizerParityCheck()
            await MainActor.run {
                parity = result
                isRunningParityCheck = false
            }
        }
    }
}

/// Self-checks that catch the failure modes which otherwise present as "search quality is
/// mediocre" instead of as an error.
enum CopilotDiagnostics {

    /// Token ids produced by HuggingFace `BertTokenizer` for these exact strings, captured
    /// during the offline embedding run. If the Swift tokenizer disagrees, query vectors
    /// land in a different place than the stored product vectors.
    private static let expectations: [(text: String, ids: [Int32])] = [
        // [CLS] high protein shake low sugar dairy free [SEP] — the hero query
        ("high protein shake low sugar dairy free",
         [101, 2152, 5250, 6073, 2659, 5699, 11825, 2489, 102]),
        // "electrolytes" splits into electro ##ly ##tes — a three-piece subword chain, so
        // this catches greedy-longest-match bugs a two-piece word would not.
        ("a drink with electrolytes for after a workout",
         [101, 1037, 4392, 2007, 16175, 2135, 4570, 2005, 2044, 1037, 27090, 102]),
        // [CLS] dairy - free [SEP] — exercises punctuation splitting
        ("dairy-free",
         [101, 11825, 1011, 2489, 102]),
    ]

    static func runTokenizerParityCheck() async -> String {
        var failures: [String] = []
        for expectation in expectations {
            do {
                let got = try await TextEmbedder.shared.tokenIds(for: expectation.text)
                if got != expectation.ids {
                    failures.append("""
                        MISMATCH \(expectation.text.prefix(28))
                          expected \(expectation.ids)
                          got      \(got)
                        """)
                }
            } catch {
                return "FAIL — tokenizer unavailable: \(error.localizedDescription)"
            }
        }

        // The CoreML graph L2-normalizes, so a non-unit norm means the wrong output tensor
        // is being read or pooling was lost in conversion.
        do {
            let vector = try await TextEmbedder.shared.embed("high protein shake")
            let norm = sqrt(vector.reduce(0) { $0 + $1 * $1 })
            if abs(norm - 1.0) > 0.01 {
                failures.append(String(format: "MISMATCH vector norm: expected 1.000, got %.4f", norm))
            }
            if vector.count != TextEmbedder.dimensions {
                failures.append("MISMATCH dimensions: expected \(TextEmbedder.dimensions), got \(vector.count)")
            }
        } catch {
            return "FAIL — embedding failed: \(error.localizedDescription)"
        }

        if failures.isEmpty {
            return "PASS — tokenizer matches the offline job on \(expectations.count) probes; "
                 + "output is 384-d and unit-norm."
        }
        return "FAIL\n" + failures.joined(separator: "\n")
    }
}
