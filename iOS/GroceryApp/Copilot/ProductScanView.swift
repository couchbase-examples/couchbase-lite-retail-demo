import SwiftUI
import UIKit

/// Step 2, Case 1 — point the camera at a product, get told where it belongs.
///
/// The camera is offered here and deliberately *not* on the audit screen. The audit has to
/// reconstruct spatial layout, so it needs the fixed framing of the golden imagery; identifying
/// one item has no spatial constraint, so a handheld frame is exactly the right input. Same
/// CLIP model, same collection of vectors, very different tolerance for how the photo was taken.
struct ProductScanView: View {
    @ObservedObject var scanService: ProductScanService
    /// Hands the identified product's shelf to the audit — the rest of PRD Case 1.
    let onAuditShelf: (ShelfContext) -> Void

    @State private var captured: UIImage?
    @State private var matches: [ScanMatch] = []
    @State private var isIdentifying = false
    @State private var errorMessage: String?
    @State private var showCamera = false
    @State private var vectorsMissing = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if vectorsMissing { missingVectorsBanner }

            captureCard

            if isIdentifying { identifyingIndicator }
            if let errorMessage { errorBanner(errorMessage) }
            if !matches.isEmpty, !isIdentifying { resultsCard }
        }
        .onAppear { vectorsMissing = !scanService.hasImageVectors() }
        .sheet(isPresented: $showCamera) {
            ShelfCameraPicker { image in
                showCamera = false
                guard let image else { return }
                captured = image
                identify(image)
            }
        }
    }

    // MARK: - Capture

    private var captureCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("SCAN A PRODUCT")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            Text("Point the camera at an item on the shelf. It is embedded on-device with CLIP "
                 + "and matched against the product catalogue by vector search — no network "
                 + "round-trip.")
                .font(.caption).foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            if let captured {
                Image(uiImage: captured)
                    .resizable().scaledToFit()
                    .frame(maxWidth: .infinity).frame(height: 170)
                    .background(CopilotTheme.inset)
                    .cornerRadius(8)
            }

            Button {
                showCamera = true
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "camera.fill")
                    Text(captured == nil ? "Scan product" : "Scan another")
                }
                .font(.subheadline.weight(.semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(CopilotTheme.action)
                .cornerRadius(10)
            }
            .buttonStyle(.plain)
            .disabled(isIdentifying)
        }
        .padding(14)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    // MARK: - Results

    private var resultsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("IDENTIFIED")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            if let best = matches.first,
               best.distance > ProductScanService.noMatchThreshold {
                // Nearest neighbour is always *something*. Saying so plainly beats naming a row
                // the model is not actually confident about.
                Label("No confident match — closest is \(best.name) at "
                      + String(format: "%.2f", best.distance)
                      + ". Try filling more of the frame with the product.",
                      systemImage: "questionmark.circle")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            ForEach(Array(matches.enumerated()), id: \.element.id) { index, match in
                matchRow(match, rank: index + 1)
            }

            Text(String(format: "On-device: %.0f ms CLIP embed · %.1f ms vector search",
                        scanService.lastEmbedMilliseconds, scanService.lastSearchMilliseconds))
                .font(.caption2.monospaced()).foregroundColor(.secondary)
        }
        .padding(14)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    private func matchRow(_ match: ScanMatch, rank: Int) -> some View {
        let isTop = rank == 1
        return VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top, spacing: 10) {
                CachedAsyncImage(url: match.imageURL ?? "",
                                 placeholder: Image(systemName: "cart.fill"))
                    .frame(width: 54, height: 54)
                    .background(CopilotTheme.inset)
                    .cornerRadius(8)

                VStack(alignment: .leading, spacing: 4) {
                    Text(match.name)
                        .font(.subheadline.weight(isTop ? .semibold : .regular))
                        .fixedSize(horizontal: false, vertical: true)
                    HStack(spacing: 6) {
                        if let brand = match.brand {
                            Text(brand).font(.caption2).foregroundColor(.secondary)
                            Text("·").font(.caption2).foregroundColor(.secondary)
                        }
                        Text(String(format: "$%.2f", match.price)).font(.caption2)
                        Text("·").font(.caption2).foregroundColor(.secondary)
                        Text("\(match.quantity) in stock")
                            .font(.caption2)
                            .foregroundColor(match.quantity > 0 ? .secondary : CopilotTheme.missing)
                    }
                    HStack(spacing: 6) {
                        Text("\(match.similarityPercent)% match")
                            .font(.caption2.weight(.semibold))
                            .foregroundColor(CopilotTheme.action)
                        Text("distance \(String(format: "%.4f", match.distance))")
                            .font(.caption2.monospaced()).foregroundColor(.secondary)
                    }
                }
                Spacer(minLength: 0)
            }

            // The payoff: where to put it back. Tapping carries the shelf into the audit.
            if let context = match.shelfContext, let location = match.location {
                Button {
                    onAuditShelf(context)
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "mappin.and.ellipse")
                            .font(.caption2).foregroundColor(CopilotTheme.action)
                        Text(locationText(location))
                            .font(.caption.weight(.medium)).foregroundColor(.primary)
                        Spacer()
                        Text("Check shelf").font(.caption2.weight(.semibold))
                            .foregroundColor(CopilotTheme.action)
                        Image(systemName: "chevron.right")
                            .font(.caption2).foregroundColor(CopilotTheme.action)
                    }
                    .padding(.horizontal, 10).padding(.vertical, 8)
                    .background(CopilotTheme.tint(CopilotTheme.action))
                    .cornerRadius(8)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(10)
        .background(isTop ? CopilotTheme.tint(CopilotTheme.compliant) : CopilotTheme.inset)
        .cornerRadius(9)
    }

    private func locationText(_ location: GroceryItem.Location) -> String {
        var parts = ["Aisle \(location.aisle)"]
        if let shelf = location.shelf { parts.append("shelf \(shelf)") }
        if location.bin > 0 { parts.append("bin \(location.bin)") }
        if let section = location.section { parts.append("· \(section)") }
        return parts.joined(separator: " ")
    }

    // MARK: - Chrome

    /// Without the image pass on the inventory documents there is nothing to match against, and
    /// the screen would look broken rather than unconfigured.
    private var missingVectorsBanner: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(CopilotTheme.degraded)
            Text("No product image vectors in this store's inventory yet. Scanning needs "
                 + "`embedding.image` on the inventory documents — re-import the dataset "
                 + "produced by tools/embeddings/embed_product_images_onnx.py.")
                .font(.caption).fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
        }
        .padding(12)
        .background(CopilotTheme.tint(CopilotTheme.degraded))
        .cornerRadius(10)
    }

    private var identifyingIndicator: some View {
        HStack(spacing: 10) {
            ProgressView()
            Text("Embedding the frame on-device…")
                .font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 18)
    }

    private func errorBanner(_ message: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(CopilotTheme.degraded)
            Text(message).font(.caption).fixedSize(horizontal: false, vertical: true)
            Spacer()
            Button { errorMessage = nil } label: {
                Image(systemName: "xmark").font(.caption2).foregroundColor(.secondary)
            }
        }
        .padding(12)
        .background(CopilotTheme.tint(CopilotTheme.degraded))
        .cornerRadius(10)
    }

    // MARK: - Actions

    private func identify(_ image: UIImage) {
        isIdentifying = true
        errorMessage = nil
        matches = []
        Task {
            do {
                let found = try await scanService.identify(image: image)
                await MainActor.run {
                    matches = found
                    isIdentifying = false
                    if found.isEmpty {
                        errorMessage = "Nothing to match against — the inventory documents have "
                                     + "no image vectors in this store."
                    }
                }
            } catch {
                await MainActor.run {
                    errorMessage = "Scan failed: \(error.localizedDescription)"
                    isIdentifying = false
                }
            }
        }
    }
}
