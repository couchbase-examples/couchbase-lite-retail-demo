import SwiftUI

/// Step 3 — conversational advice grounded in the store's own knowledge collection.
///
/// Retrieval is a vector search over `product_knowledge` in Couchbase Lite; generation is
/// Apple's on-device model. Nothing leaves the device in either half. The retrieved sources
/// are always shown, so a viewer can check the answer against what it was actually given —
/// which is the difference between demonstrating RAG and demonstrating a chatbot.
struct RAGAssistantView: View {
    @ObservedObject var searchService: CopilotSearchService
    /// Set when the associate tapped "Ask" on a search result.
    let product: GroceryItem?

    @State private var question = ""
    @State private var answer = ""
    @State private var chunks: [KnowledgeHit] = []
    @State private var isWorking = false
    @State private var stage: String?
    @State private var errorMessage: String?
    @State private var showSources = false
    @State private var retrieveMilliseconds: Double = 0

    private let accent = Color(hex: "FC9C0C")
    private let cream = Color(hex: "FFF0DB")

    /// Grocery-scoped prompts. The seeded knowledge covers protein timing, low-sugar recovery
    /// drinks, electrolytes, dairy-free protein and pre-run fuelling, so these are questions
    /// the sources can actually answer — a RAG demo that retrieves nothing relevant is worse
    /// than no demo.
    private var suggestions: [String] {
        if AppConfig.footwearNarrativeEnabled, let product, product.type == "Footwear" {
            return ["Are these good for a beginner runner?",
                    "Will these hold up on wet trails?",
                    "How should I pick the right size?"]
        }
        if product != nil {
            return ["I'm training for my first 5k — is this good for recovery?",
                    "How much protein do I actually need after a run?",
                    "Is this better than a sports drink?"]
        }
        return ["I'm training for my first 5k — what should I drink after a run?",
                "How much protein do I need for endurance recovery?",
                "What are my dairy-free protein options?"]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let product { productContext(product) }
            askCard
            if let errorMessage { banner(errorMessage, icon: "exclamationmark.triangle.fill",
                                         tint: .orange) }
            if isWorking || !answer.isEmpty { answerCard }
            if !chunks.isEmpty { sourcesCard }
            if answer.isEmpty && !isWorking { introCard }
        }
    }

    // MARK: - Cards

    private func productContext(_ product: GroceryItem) -> some View {
        HStack(spacing: 10) {
            ProductThumbnail(item: product)
                .frame(width: 44, height: 44)
                .background(Color(UIColor.secondarySystemBackground))
                .cornerRadius(6)
            VStack(alignment: .leading, spacing: 2) {
                Text("Asking about").font(.caption2).foregroundColor(.secondary)
                Text(product.name).font(.caption.weight(.semibold))
            }
            Spacer()
        }
        .padding(10)
        .background(accent.opacity(0.12))
        .cornerRadius(10)
    }

    private var askCard: some View {
        VStack(spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: "bubble.left.and.text.bubble.right").foregroundColor(accent)
                TextField("Ask a question…", text: $question, axis: .vertical)
                    .lineLimit(1...3)
                    .submitLabel(.send)
                    .onSubmit { ask() }
                if !question.isEmpty {
                    Button { question = "" } label: {
                        Image(systemName: "xmark.circle.fill").foregroundColor(.gray)
                    }
                }
            }
            .padding(12)
            .background(Color(UIColor.systemBackground))
            .cornerRadius(12)

            Button { ask() } label: {
                Text("Ask")
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity).padding(.vertical, 10)
                    .background(question.isEmpty ? Color.gray.opacity(0.3) : accent)
                    .foregroundColor(.white).cornerRadius(10)
            }
            .disabled(question.isEmpty || isWorking)
        }
    }

    private var answerCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: "sparkles").font(.caption).foregroundColor(accent)
                Text(RAGBackend.backendDescription)
                    .font(.caption2.weight(.semibold)).foregroundColor(.secondary)
                Spacer()
                if isWorking { ProgressView().scaleEffect(0.7) }
            }

            if let stage, answer.isEmpty {
                Text(stage).font(.caption).foregroundColor(.secondary)
            }

            if !answer.isEmpty {
                Text(answer)
                    .font(.subheadline)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if retrieveMilliseconds > 0 {
                Text(String(format: "Retrieved %d chunks in %.1f ms by vector search",
                            chunks.count, retrieveMilliseconds))
                    .font(.caption2.monospaced()).foregroundColor(.secondary)
            }
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var sourcesCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button { withAnimation { showSources.toggle() } } label: {
                HStack {
                    Text(showSources
                         ? "Hide the \(chunks.count) sources this used"
                         : "Show the \(chunks.count) sources this used")
                        .font(.caption.weight(.semibold)).foregroundColor(accent)
                    Spacer()
                    Image(systemName: showSources ? "chevron.up" : "chevron.down")
                        .font(.caption2).foregroundColor(accent)
                }
            }
            .buttonStyle(.plain)

            if showSources {
                ForEach(chunks) { chunk in
                    VStack(alignment: .leading, spacing: 3) {
                        HStack {
                            Text(chunk.title).font(.caption.weight(.semibold))
                            Spacer()
                            Text("d=\(String(format: "%.3f", chunk.distance))")
                                .font(.caption2.monospaced()).foregroundColor(.secondary)
                        }
                        Text(chunk.chunkText)
                            .font(.caption2).foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                        Text(chunk.sourceDoc)
                            .font(.caption2.italic()).foregroundColor(.secondary)
                    }
                    .padding(10)
                    .background(cream)
                    .cornerRadius(8)
                }
            }
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var introCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Grounded advice, on-device").font(.headline)
                Text("The question is embedded here, matched against the store's "
                     + "`product_knowledge` collection by vector search, and the retrieved "
                     + "chunks are passed to Apple's on-device model. No cloud round-trip, "
                     + "and the answer is limited to what the sources actually say.")
                    .font(.caption).foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if case .retrievalOnly(let reason) = RAGBackend.availability {
                banner(reason, icon: "info.circle.fill", tint: .blue)
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("TRY ONE OF THESE")
                    .font(.caption2.weight(.bold)).foregroundColor(.secondary)
                ForEach(suggestions, id: \.self) { suggestion in
                    Button {
                        question = suggestion
                        ask()
                    } label: {
                        HStack {
                            Text("“\(suggestion)”").font(.caption)
                                .multilineTextAlignment(.leading)
                            Spacer()
                            Image(systemName: "arrow.right.circle.fill").foregroundColor(accent)
                        }
                        .padding(10).frame(maxWidth: .infinity)
                        .background(cream).cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(16)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private func banner(_ message: String, icon: String, tint: Color) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: icon).foregroundColor(tint)
            Text(message).font(.caption).fixedSize(horizontal: false, vertical: true)
            Spacer()
        }
        .padding(12).background(tint.opacity(0.12)).cornerRadius(10)
    }

    // MARK: - Ask

    private func ask() {
        let trimmed = question.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        isWorking = true
        errorMessage = nil
        answer = ""
        chunks = []
        stage = "Searching the knowledge collection…"

        Task {
            do {
                // ---- retrieve ----
                let started = DispatchTime.now().uptimeNanoseconds
                let retrieved = try await searchService.retrieveKnowledge(
                    question: trimmed,
                    relatedCategory: product?.type
                )
                let elapsed = Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000

                await MainActor.run {
                    chunks = retrieved
                    retrieveMilliseconds = elapsed
                    stage = "Writing an answer from \(retrieved.count) sources…"
                }

                guard !retrieved.isEmpty else {
                    await MainActor.run {
                        errorMessage = "Nothing in this store's knowledge collection covers "
                                     + "that question."
                        isWorking = false
                        stage = nil
                    }
                    return
                }

                // ---- generate ----
                guard RAGBackend.availability.canGenerate else {
                    await MainActor.run {
                        if case .retrievalOnly(let reason) = RAGBackend.availability {
                            errorMessage = reason
                        }
                        showSources = true
                        isWorking = false
                        stage = nil
                    }
                    return
                }

                let stream = RAGBackend.streamAnswer(question: trimmed, chunks: retrieved,
                                                     product: product)
                for try await partial in stream {
                    await MainActor.run { answer = partial }
                }
                await MainActor.run {
                    isWorking = false
                    stage = nil
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    showSources = !chunks.isEmpty
                    isWorking = false
                    stage = nil
                }
            }
        }
    }
}
