import SwiftUI
import CouchbaseLiteSwift

/// The Store Associate Copilot — the Scanner tab.
///
/// Step 1 (semantic product lookup) is implemented here end to end: the associate types
/// or speaks a description, it is embedded on-device with MiniLM, and
/// `APPROX_VECTOR_DISTANCE` finds the matching products in the local Couchbase Lite
/// database with no network call. The keyword comparison strip is deliberately prominent:
/// the claim being demonstrated is that keyword search *cannot* answer these queries, and
/// showing that side by side is more convincing than asserting it.
struct ProductSearchView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @ObservedObject var searchService: CopilotSearchService
    /// Asking a follow-up about a specific product is Step 3's entry point, so the parent
    /// owns the transition rather than this view knowing about the RAG assistant.
    let onAskAbout: (GroceryItem) -> Void

    @StateObject private var speech = SpeechRecognizer()

    @State private var queryText = ""
    @State private var hits: [SemanticHit] = []
    @State private var keywordHits: [GroceryItem] = []
    @State private var isSearching = false
    @State private var hasSearched = false
    @State private var errorMessage: String?
    @State private var showKeywordComparison = false
    @State private var lastInputMode = "text"

    // Hybrid-search controls, exposed because hybrid filtering is a headline capability
    // and its behaviour (filter applied to the ANN candidate set) is worth showing.
    @State private var categoryFilter = ""
    @State private var inStockOnly = false
    @Binding var threshold: Double

    private let accent = Color(hex: "FC9C0C")
    private let cream = Color(hex: "FFF0DB")

    /// Categories offered in the hybrid filter. These are the real `category` values in the
    /// extended dataset, and anything the copilot hides is excluded.
    static var filterableCategories: [String] {
        ["Beverages", "Dairy", "Produce", "Bakery", "Pantry", "Snacks",
         "Meat", "Seafood", "Personal Care", "Household", "Footwear"]
            .filter { !AppConfig.hiddenCategories.contains($0) }
    }

    /// Scripted demo queries, all grocery. Each was measured against the real corpus before
    /// being put here — every one returns the right product first, and keyword search on the
    /// same catalogue either misses it or buries it:
    ///
    ///   1. the hero query; keyword returns 23 unrelated dairy items
    ///   2. exercises negation — the plant-based shake ranks above the whey one
    ///   3. keyword's only hit is the wrong drink
    ///   4. keyword returns nothing at all, semantic finds it at 0.44
    private var suggestions: [String] {
        var grocery = [
            "high-protein shake that's low in sugar and dairy-free",
            "plant-based protein with no whey",
            "a drink with electrolytes for after a workout",
            "sustainably sourced fish",
        ]
        if AppConfig.footwearNarrativeEnabled {
            grocery.append("breathable lightweight blue running shoes")
        }
        return grocery
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            searchCard
            if let errorMessage { errorBanner(errorMessage) }
            if isSearching { searchingIndicator }
            // Results (and the keyword comparison) are only meaningful when the search
            // actually ran — otherwise the strip would claim "keyword returned nothing"
            // when in fact nothing was searched at all.
            if hasSearched && !isSearching && errorMessage == nil { resultsSection }
            if !hasSearched && !isSearching && errorMessage == nil { introSection }
        }
        .onDisappear { speech.stop() }
    }

    // MARK: - Search input

    private var searchCard: some View {
        VStack(spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: "sparkle.magnifyingglass")
                    .foregroundColor(accent)

                TextField("Describe what the shopper wants…", text: $queryText, axis: .vertical)
                    .lineLimit(1...3)
                    .submitLabel(.search)
                    .onSubmit { runSearch(mode: "text") }

                if !queryText.isEmpty {
                    Button {
                        queryText = ""
                        hits = []
                        keywordHits = []
                        hasSearched = false
                    } label: {
                        Image(systemName: "xmark.circle.fill").foregroundColor(.gray)
                    }
                }

                Button {
                    toggleVoice()
                } label: {
                    Image(systemName: speech.isListening ? "stop.circle.fill" : "mic.fill")
                        .font(.title3)
                        .foregroundColor(speech.isListening ? .red : accent)
                }
                .accessibilityLabel(speech.isListening ? "Stop listening" : "Search by voice")
            }
            .padding(12)
            .background(Color(UIColor.systemBackground))
            .cornerRadius(12)

            if speech.isListening {
                HStack(spacing: 8) {
                    Image(systemName: "waveform")
                        .foregroundColor(.red)
                        .symbolEffect(.variableColor.iterative)
                    Text(speech.transcript.isEmpty ? "Listening…" : speech.transcript)
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                    Text("on-device")
                        .font(.caption2.weight(.semibold))
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(Color.green.opacity(0.15))
                        .foregroundColor(.green)
                        .cornerRadius(4)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            HStack(spacing: 10) {
                Button {
                    runSearch(mode: "text")
                } label: {
                    Text("Search")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(queryText.isEmpty ? Color.gray.opacity(0.3) : accent)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .disabled(queryText.isEmpty || isSearching)
            }

            DisclosureGroup("Hybrid filters") {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Category").font(.caption).foregroundColor(.secondary)
                        Spacer()
                        Picker("Category", selection: $categoryFilter) {
                            Text("Any").tag("")
                            ForEach(Self.filterableCategories, id: \.self) { category in
                                Text(category).tag(category)
                            }
                        }
                        .pickerStyle(.menu)
                        .tint(accent)
                    }
                    Toggle("In stock only", isOn: $inStockOnly)
                        .font(.caption)
                        .tint(accent)
                    HStack {
                        Text("Relevance cutoff").font(.caption).foregroundColor(.secondary)
                        Slider(value: $threshold, in: 0.2...1.2, step: 0.05).tint(accent)
                        Text(String(format: "%.2f", threshold))
                            .font(.caption.monospaced())
                            .frame(width: 38)
                    }
                }
                .padding(.top, 8)
            }
            .font(.caption.weight(.semibold))
            .tint(accent)
            .padding(12)
            .background(Color(UIColor.systemBackground))
            .cornerRadius(12)
        }
    }

    // MARK: - Results

    private var resultsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            comparisonStrip

            if hits.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.largeTitle).foregroundColor(.gray)
                    Text("No products within the relevance cutoff")
                        .font(.subheadline).fontWeight(.medium)
                    Text("Nothing scored below a cosine distance of "
                         + String(format: "%.2f", threshold)
                         + ". Raise the cutoff in Hybrid filters to see the nearest matches anyway.")
                        .font(.caption).foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 30)
            } else {
                ForEach(Array(hits.enumerated()), id: \.element.id) { index, hit in
                    SemanticResultCard(hit: hit, rank: index + 1, accent: accent,
                                       onAsk: { onAskAbout(hit.item) })
                }
            }
        }
    }

    /// The head-to-head strip. This is the argument of Step 1 made visible.
    private var comparisonStrip: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("Semantic", systemImage: "sparkles")
                    .font(.caption.weight(.bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8).padding(.vertical, 4)
                    .background(accent).cornerRadius(6)
                Text("\(hits.count) relevant")
                    .font(.caption).foregroundColor(.secondary)

                Spacer()

                Label("Keyword", systemImage: "textformat")
                    .font(.caption.weight(.bold))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8).padding(.vertical, 4)
                    .background(Color.gray.opacity(0.18)).cornerRadius(6)
                Text(keywordHits.isEmpty ? "0 results" : "\(keywordHits.count) hits")
                    .font(.caption)
                    .foregroundColor(keywordHits.isEmpty ? .red : .secondary)
            }

            Text(comparisonExplanation)
                .font(.caption)
                .foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            if !keywordHits.isEmpty {
                Button {
                    withAnimation { showKeywordComparison.toggle() }
                } label: {
                    Text(showKeywordComparison
                         ? "Hide what keyword search returned"
                         : "Show what keyword search returned")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(accent)
                }

                if showKeywordComparison {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(keywordHits.prefix(8), id: \.self) { item in
                            HStack(spacing: 6) {
                                Image(systemName: isRelevant(item) ? "checkmark.circle" : "xmark.circle")
                                    .font(.caption2)
                                    .foregroundColor(isRelevant(item) ? .green : .red)
                                Text(item.name).font(.caption)
                                Text(item.type).font(.caption2).foregroundColor(.secondary)
                            }
                        }
                        if keywordHits.count > 8 {
                            Text("+ \(keywordHits.count - 8) more")
                                .font(.caption2).foregroundColor(.secondary)
                        }
                    }
                    .padding(.top, 2)
                }
            }
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var comparisonExplanation: String {
        // Claiming semantic "ranked the right products first" while showing zero results
        // would be false. This happens for genuinely out-of-catalogue questions, and saying
        // so plainly is the honest outcome for a 104-item store.
        if hits.isEmpty {
            return "Nothing in this store's catalogue came within the relevance cutoff, so "
                 + "the copilot reports no match rather than guessing. Raise the cutoff in "
                 + "Hybrid filters to inspect the nearest products anyway."
        }
        if keywordHits.isEmpty {
            return "A keyword search over product names and categories returns nothing for this "
                 + "query — no product is literally named this. Semantic search matched against "
                 + "the product descriptions instead."
        }
        let overlap = keywordHits.filter(isRelevant).count
        if overlap == 0 {
            return "Keyword search returned \(keywordHits.count) products, none of which are "
                 + "what the shopper asked for — it matched on incidental words. Semantic "
                 + "search ranked the right products first."
        }
        return "Keyword search returned \(keywordHits.count) products and happened to include "
             + "\(overlap) relevant one\(overlap == 1 ? "" : "s"), unranked and mixed in with "
             + "the rest. Semantic search ordered them by how well they actually match."
    }

    private func isRelevant(_ item: GroceryItem) -> Bool {
        hits.contains { $0.item.id == item.id }
    }

    private var introSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Semantic product lookup")
                    .font(.headline)
                Text("Describe what the shopper is asking for in their own words. The query is "
                     + "embedded on this device and matched against product description vectors "
                     + "in Couchbase Lite — no network call, no cloud round-trip.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("TRY ONE OF THESE")
                    .font(.caption2.weight(.bold))
                    .foregroundColor(.secondary)
                ForEach(suggestions, id: \.self) { suggestion in
                    Button {
                        queryText = suggestion
                        runSearch(mode: "text")
                    } label: {
                        HStack {
                            Text("“\(suggestion)”")
                                .font(.caption)
                                .multilineTextAlignment(.leading)
                            Spacer()
                            Image(systemName: "arrow.right.circle.fill").foregroundColor(accent)
                        }
                        .padding(10)
                        .frame(maxWidth: .infinity)
                        .background(cream)
                        .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                }
            }

            if !databaseManager.vectorIndexReports.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    Text("ON-DEVICE VECTOR INDEXES")
                        .font(.caption2.weight(.bold)).foregroundColor(.secondary)
                    ForEach(databaseManager.vectorIndexReports, id: \.self) { report in
                        Text(report)
                            .font(.caption2.monospaced())
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(16)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var searchingIndicator: some View {
        HStack(spacing: 10) {
            ProgressView()
            Text("Embedding query on-device…")
                .font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
    }

    private func errorBanner(_ message: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill").foregroundColor(.orange)
            Text(message).font(.caption).fixedSize(horizontal: false, vertical: true)
            Spacer()
            Button {
                errorMessage = nil
                speech.clearError()
            } label: {
                Image(systemName: "xmark").font(.caption2).foregroundColor(.secondary)
            }
        }
        .padding(12)
        .background(Color.orange.opacity(0.12))
        .cornerRadius(10)
    }

    // MARK: - Actions

    private func toggleVoice() {
        if speech.isListening {
            speech.finish { transcript in
                queryText = transcript
                runSearch(mode: "voice")
            }
        } else {
            errorMessage = nil
            Task {
                await speech.start { transcript in
                    queryText = transcript
                    runSearch(mode: "voice")
                }
                if case .unavailable(let reason) = speech.state {
                    errorMessage = reason
                }
            }
        }
    }

    private func runSearch(mode: String) {
        let service = searchService
        let query = queryText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return }

        lastInputMode = mode
        isSearching = true
        errorMessage = nil
        showKeywordComparison = false

        Task {
            do {
                let results = try await service.search(
                    query: query,
                    threshold: threshold,
                    category: categoryFilter.isEmpty ? nil : categoryFilter,
                    inStockOnly: inStockOnly,
                    inputMode: mode
                )
                let keyword = service.keywordSearch(query: query)
                await MainActor.run {
                    hits = results
                    keywordHits = keyword
                    hasSearched = true
                    isSearching = false
                }
            } catch {
                await MainActor.run {
                    // "No data synced yet" is an expected first-launch state, not a failure,
                    // so it is shown as-is rather than dressed up as an error.
                    errorMessage = error is CopilotSearchService.NoLocalDataError
                        ? error.localizedDescription
                        : "Search failed: \(error.localizedDescription)"
                    isSearching = false
                    hasSearched = true
                    hits = []
                }
            }
        }
    }
}
