import SwiftUI
import CouchbaseLiteSwift

/// The Store Associate Copilot — the Scanner tab.
///
/// Three steps, all running on-device against Couchbase Lite with no cloud round-trip:
///
///  1. **Find** — semantic product lookup. The query is embedded with MiniLM and matched
///     against product description vectors.
///  2. **Planogram** — visual audit. Each expected shelf position is cropped from a photo,
///     embedded with CLIP, and matched against product image vectors.
///  3. **Ask** — retrieval-augmented answers. Knowledge chunks are retrieved by vector
///     search and passed to Apple's on-device language model.
///
/// This view owns the state that outlives a mode switch — the services, the relevance
/// threshold, and the product carried from a search result into the assistant — so moving
/// between steps mid-demo does not reset anything.
struct CopilotView: View {
    @EnvironmentObject var databaseManager: DatabaseManager

    enum Mode: String, CaseIterable {
        case find = "Find"
        // Named "Planogram" rather than "Shelf" per review feedback — the planogram is the
        // expected layout being checked against, which is the term the retail audience uses.
        case shelf = "Planogram"
        case ask = "Ask"

        var icon: String {
            switch self {
            case .find: return "sparkle.magnifyingglass"
            case .shelf: return "camera.viewfinder"
            case .ask: return "bubble.left.and.text.bubble.right"
            }
        }
    }

    @State private var mode: Mode = .find
    @State private var searchService: CopilotSearchService?
    @State private var auditService: ShelfAuditService?
    @State private var taskService: TaskService?
    @State private var threshold = AppConfig.defaultRelevanceThreshold
    @State private var showDiagnostics = false

    /// Product context handed from a search result to the assistant.
    @State private var askAbout: GroceryItem?
    /// Finding handed from the shelf audit to Request Help.
    @State private var helpRequest: (finding: PositionFinding, planogram: Planogram)?

    private let accent = Color(hex: "FC9C0C")
    private let cream = Color(hex: "FFF0DB")

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    modePicker

                    if let searchService, let auditService {
                        switch mode {
                        case .find:
                            ProductSearchView(
                                searchService: searchService,
                                onAskAbout: { item in
                                    askAbout = item
                                    mode = .ask
                                },
                                threshold: $threshold
                            )
                        case .shelf:
                            ShelfAuditView(
                                auditService: auditService,
                                onRequestHelp: { finding, planogram in
                                    helpRequest = (finding, planogram)
                                }
                            )
                        case .ask:
                            RAGAssistantView(
                                searchService: searchService,
                                product: askAbout
                            )
                        }
                    } else {
                        ProgressView("Preparing copilot…")
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 40)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .background(cream.ignoresSafeArea())
            .navigationTitle("Copilot")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showDiagnostics = true } label: { Image(systemName: "cpu") }
                        .accessibilityLabel("Behind the scenes")
                }
            }
            .sheet(isPresented: $showDiagnostics) {
                CopilotDiagnosticsView(
                    telemetry: searchService?.telemetry ?? SearchTelemetry(),
                    threshold: $threshold
                )
                .environmentObject(databaseManager)
            }
            .sheet(isPresented: Binding(
                get: { helpRequest != nil },
                set: { if !$0 { helpRequest = nil } }
            )) {
                if let helpRequest, let taskService {
                    RequestHelpView(
                        finding: helpRequest.finding,
                        planogram: helpRequest.planogram,
                        taskService: taskService
                    )
                }
            }
        }
        .onAppear {
            if searchService == nil {
                searchService = CopilotSearchService(databaseManager: databaseManager)
            }
            if auditService == nil {
                auditService = ShelfAuditService(databaseManager: databaseManager)
            }
            if taskService == nil {
                taskService = TaskService(databaseManager: databaseManager)
            }
        }
    }

    private var modePicker: some View {
        HStack(spacing: 6) {
            ForEach(Mode.allCases, id: \.self) { candidate in
                Button {
                    withAnimation(.easeInOut(duration: 0.15)) { mode = candidate }
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: candidate.icon).font(.caption)
                        Text(candidate.rawValue).font(.caption.weight(.semibold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 9)
                    .background(mode == candidate ? accent : Color(UIColor.systemBackground))
                    .foregroundColor(mode == candidate ? .white : .primary)
                    .cornerRadius(9)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - Result card

/// A single semantic match. Leads with location, because the associate's next physical
/// action is walking to the shelf.
struct SemanticResultCard: View {
    let hit: SemanticHit
    let rank: Int
    let accent: Color
    var onAsk: (() -> Void)?

    private var item: GroceryItem { hit.item }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            ProductThumbnail(item: item)
                .frame(width: 70, height: 70)
                .background(Color(UIColor.secondarySystemBackground))
                .cornerRadius(8)

            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .firstTextBaseline, spacing: 6) {
                    Text("\(rank).")
                        .font(.subheadline.weight(.bold))
                        .foregroundColor(accent)
                    Text(item.name)
                        .font(.subheadline.weight(.semibold))
                        .fixedSize(horizontal: false, vertical: true)
                }

                HStack(spacing: 6) {
                    if let brand = item.brand {
                        Text(brand).font(.caption2).foregroundColor(.secondary)
                    }
                    Text("·").font(.caption2).foregroundColor(.secondary)
                    Text(String(format: "$%.2f", item.price))
                        .font(.caption2.weight(.medium))
                    Text("·").font(.caption2).foregroundColor(.secondary)
                    Text("\(item.quantity) in stock")
                        .font(.caption2)
                        .foregroundColor(item.quantity > 0 ? .secondary : .red)
                }

                // Location first: this is what the associate acts on.
                if let location = item.location {
                    HStack(spacing: 4) {
                        Image(systemName: "mappin.and.ellipse")
                            .font(.caption2).foregroundColor(accent)
                        Text(locationText(location))
                            .font(.caption.weight(.medium))
                    }
                }

                if let badges = item.attributes?.displayBadges, !badges.isEmpty {
                    FlowRow(spacing: 4) {
                        ForEach(badges, id: \.self) { badge in
                            Text(badge)
                                .font(.caption2)
                                .padding(.horizontal, 6).padding(.vertical, 2)
                                .background(accent.opacity(0.14))
                                .foregroundColor(.primary.opacity(0.75))
                                .cornerRadius(4)
                        }
                    }
                }

                HStack(spacing: 8) {
                    Text("\(hit.similarityPercent)% match")
                        .font(.caption2.weight(.semibold))
                        .foregroundColor(accent)
                    Text("distance \(String(format: "%.4f", hit.distance))")
                        .font(.caption2.monospaced())
                        .foregroundColor(.secondary)
                    if let onAsk {
                        Spacer()
                        Button(action: onAsk) {
                            HStack(spacing: 3) {
                                Image(systemName: "bubble.left.and.text.bubble.right")
                                Text("Ask")
                            }
                            .font(.caption2.weight(.semibold))
                            .padding(.horizontal, 8).padding(.vertical, 4)
                            .background(accent.opacity(0.16))
                            .foregroundColor(.primary)
                            .cornerRadius(6)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private func locationText(_ location: GroceryItem.Location) -> String {
        var parts = ["Aisle \(location.aisle)"]
        if let shelf = location.shelf { parts.append("shelf \(shelf)") }
        if location.bin > 0 { parts.append("bin \(location.bin)") }
        if let section = location.section { parts.append("· \(section)") }
        return parts.joined(separator: " ")
    }
}

/// Product image, fetched from the document's `imageURL` and cached to disk.
///
/// Deliberately does NOT fall back to a bundled render. This app is offline-first, and the
/// promise is that a first launch with no network shows nothing at all — so every pixel of
/// product data has to arrive from the server and then persist locally. Shipping renders
/// inside the binary would quietly break that: products would appear to have images before
/// anything had ever synced.
///
/// The consequence is visible and correct: the new Footwear and sports-nutrition SKUs show a
/// placeholder icon, because their S3 images genuinely do not exist yet (those URLs return
/// 403). See tools/embeddings/IMAGE-ASSET-REQUEST.md — that gap closes when the real photos
/// land, with no app change.
///
/// `CachedAsyncImage` writes to the on-disk image cache, which is what makes images survive a
/// relaunch with no network.
struct ProductThumbnail: View {
    let item: GroceryItem

    var body: some View {
        CachedAsyncImage(url: item.imageURL, placeholder: Image(systemName: "cart.fill"))
    }
}

/// Minimal wrapping layout for the attribute badges. `LazyVGrid` cannot size columns to
/// content, and the badge widths vary a lot ("30g protein" vs "vegan").
struct FlowRow: Layout {
    var spacing: CGFloat = 4

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > maxWidth && x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        return CGSize(width: proposal.width ?? x, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize,
                       subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX && x > bounds.minX {
                x = bounds.minX
                y += rowHeight + spacing
                rowHeight = 0
            }
            view.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
