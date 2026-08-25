import SwiftUI
import UIKit

/// Step 2 — the visual shelf audit.
///
/// The associate picks a shelf, chooses one of the bundled sample views of it, and runs the
/// audit. Everything runs on-device: the photo is tiled into the golden's grid, CLIP embeds
/// each cell, and Couchbase Lite matches it against that shelf's golden cell vectors with
/// `APPROX_VECTOR_DISTANCE`.
///
/// The layout merges two things deliberately: the golden-reference framing (so it is obvious
/// what is being compared against what) and the shelf map (so a flagged product can be located
/// on the physical shelf, not just named). Either alone left a question the other answers.
struct ShelfAuditView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @ObservedObject var auditService: ShelfAuditService
    /// Raising a Request Help task is Step 2's natural next action, so it is handed back up
    /// rather than duplicated here. Currently unused: the resolution buttons are hidden until
    /// the P2P task flow is demoable, per review feedback — the closure stays so the call site
    /// and the wiring survive intact.
    let onRequestHelp: (PositionFinding, Planogram) -> Void
    /// Aisle and shelf carried in from a Step 1 result, when the associate arrived by looking a
    /// product up rather than opening this tab cold. When set, that shelf is preselected.
    let contextLocation: ShelfContext?

    @State private var selected: Planogram?
    /// The sample view chosen but not yet audited. Picking and auditing are separate steps so
    /// the associate can see what they are about to check before committing to it.
    @State private var pendingImage: UIImage?
    @State private var pendingLabel: String = ""
    /// Which sample variant is currently loaded, so the two check buttons can show which
    /// one the result on screen actually came from.
    @State private var pendingVariant: String?
    /// Column count for the pending shelf, read once on selection so the preview can show the
    /// tiling the audit is about to use rather than re-querying on every layout pass.
    @State private var pendingGrid: PlanogramGrid?
    @State private var result: PlanogramAuditResult?
    @State private var isAuditing = false
    @State private var errorMessage: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            if auditService.planograms.isEmpty {
                emptyState
            } else {
                shelfPicker
                if let selected { goldenReferenceCard(for: selected) }
                if let pendingImage, let selected {
                    pendingCard(image: pendingImage, planogram: selected)
                }
                if isAuditing { auditingIndicator }
                if let errorMessage { errorBanner(errorMessage) }
                if let result, !isAuditing { resultsCard(result) }
            }
        }
        .onAppear {
            auditService.loadPlanograms()
            if selected == nil { selected = resolveInitialShelf() }
        }
    }

    /// Case 1 hands us a location from the product the associate just looked up; Case 2 is a
    /// cold open, where there is nothing to infer and the first shelf is as good as any.
    private func resolveInitialShelf() -> Planogram? {
        if let contextLocation,
           let match = auditService.planograms.first(where: {
               $0.aisle == contextLocation.aisle && $0.shelf == contextLocation.shelf
           }) {
            return match
        }
        return auditService.planograms.first
    }

    private func reset() {
        result = nil
        pendingImage = nil
        pendingLabel = ""
        pendingVariant = nil
        pendingGrid = nil
        errorMessage = nil
    }

    // MARK: - Shelf selection

    private var shelfPicker: some View {
        // Previously a horizontal strip of every shelf in the store, which buried the one the
        // associate actually walked to. Now it is a single dropdown: preselected from Step 1
        // when we know the location, freely choosable when we do not.
        VStack(alignment: .leading, spacing: 8) {
            Text("SHELF TO AUDIT")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            Menu {
                ForEach(auditService.planograms) { planogram in
                    Button {
                        selected = planogram
                        reset()
                    } label: {
                        Text("Aisle \(planogram.aisle) · Shelf \(planogram.shelf) — "
                             + planogram.section)
                    }
                }
            } label: {
                HStack(spacing: 10) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(selected.map { "Aisle \($0.aisle) · Shelf \($0.shelf)" }
                             ?? "Choose a shelf")
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(.primary)
                        if let selected {
                            Text(selected.section)
                                .font(.caption).foregroundColor(.secondary)
                        }
                    }
                    Spacer()
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption).foregroundColor(.secondary)
                }
                .padding(.horizontal, 14).padding(.vertical, 11)
                .background(CopilotTheme.surface)
                .cornerRadius(10)
            }

            if contextLocation != nil {
                Label("Carried over from the product you looked up in Find.",
                      systemImage: "arrow.turn.down.right")
                    .font(.caption2)
                    .foregroundColor(CopilotTheme.info)
            }
        }
    }

    // MARK: - Golden reference

    /// Shows the ideal layout for the chosen shelf, then offers the two checks.
    ///
    /// There is no "Photograph this shelf" button any more. It was the most prominent control on
    /// the screen and it could never succeed: the audit compares against golden imagery shot
    /// from one fixed angle, so an arbitrary phone photo of a real shelf will not line up, and
    /// the Simulator has no camera at all. Offering it taught the wrong thing about what the
    /// feature does. The two sample checks below are the honest demonstration.
    private func goldenReferenceCard(for planogram: Planogram) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("GOLDEN IMAGE REFERENCE (IDEAL LAYOUT)")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            AsyncImage(url: URL(string: planogram.goldenImageURL)) { phase in
                switch phase {
                case .success(let image):
                    image.resizable().aspectRatio(contentMode: .fit)
                case .failure:
                    placeholderPanel("Golden image not reachable")
                default:
                    placeholderPanel("Loading golden image…")
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 150)
            .background(CopilotTheme.inset)
            .cornerRadius(8)

            Divider()

            Text("Pick a shelf view to check against this reference. Each one is tiled into the "
                 + "planogram's grid, embedded on-device, and compared cell by cell.")
                .font(.caption).foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            VStack(spacing: 8) {
                checkButton(
                    title: "Check Organized Shelf",
                    subtitle: "A correctly stocked shelf — should come back fully compliant.",
                    variant: "golden",
                    planogram: planogram
                )
                checkButton(
                    title: "Check Disorganized Shelf",
                    subtitle: "A shelf with a product missing — should flag the gap.",
                    variant: "actual_missing",
                    planogram: planogram
                )
            }
        }
        .padding(14)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    private func placeholderPanel(_ message: String) -> some View {
        Text(message)
            .font(.caption2).foregroundColor(.secondary)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    /// A choice between two sample views, so it is styled as a selection rather than as two
    /// competing calls to action.
    ///
    /// It previously hard-coded "Check Organized Shelf" as the orange primary. That read as
    /// *this one is active* no matter which view you had actually loaded, so after tapping
    /// Disorganized the screen still highlighted Organized while showing disorganized results.
    /// Orange now follows the selection, and the real primary action is "Audit shelf" below.
    private func checkButton(title: String, subtitle: String, variant: String,
                             planogram: Planogram) -> some View {
        let isSelected = pendingVariant == variant
        return Button {
            let store = AppConfig.currentStore.rawValue
            if let image = ShelfAuditService.bundledShelfImage(
                store: store, aisle: planogram.aisle,
                shelf: planogram.shelf, variant: variant) {
                result = nil
                errorMessage = nil
                pendingImage = image
                pendingLabel = title
                pendingVariant = variant
                pendingGrid = auditService.planogramGrid(shelf: planogram.shelf)
            } else {
                reset()
                errorMessage = "Sample view \(store)_aisle\(planogram.aisle)_"
                             + "\(planogram.shelf)_\(variant).png is not in the app bundle. "
                             + "All 24 shelves ship golden and missing-stock views for both "
                             + "stores, so this usually means the file was not added to the "
                             + "target."
            }
        } label: {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: isSelected ? "largecircle.fill.circle" : "circle")
                    .font(.subheadline)
                    .foregroundColor(isSelected ? .white : .secondary)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(isSelected ? .white : .primary)
                    Text(subtitle)
                        .font(.caption2)
                        .foregroundColor(isSelected ? .white.opacity(0.9) : .secondary)
                        .fixedSize(horizontal: false, vertical: true)
                        .multilineTextAlignment(.leading)
                }
                Spacer(minLength: 0)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 12).padding(.vertical, 10)
            .background(isSelected ? CopilotTheme.action : CopilotTheme.inset)
            .cornerRadius(10)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Pending selection

    /// What is about to be audited, with the audit itself as a separate deliberate tap.
    private func pendingCard(image: UIImage, planogram: Planogram) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("SELECTED VIEW — \(pendingLabel.uppercased())")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            Image(uiImage: image)
                .resizable().scaledToFit()
                .frame(maxWidth: .infinity)
                .frame(height: 160)
                .overlay(columnGuides(cols: pendingGrid?.cols ?? 0))
                .background(CopilotTheme.inset)
                .cornerRadius(8)

            Button {
                runAudit(image: image, planogram: planogram)
            } label: {
                Text("Audit shelf")
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(CopilotTheme.action)
                    .cornerRadius(10)
            }
            .buttonStyle(.plain)
            .disabled(isAuditing)
        }
        .padding(14)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    // MARK: - Results

    private func resultsCard(_ result: PlanogramAuditResult) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("COMPLIANCE CHECK RESULT")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            summaryRow(result)

            // Reference and Selected View side by side, so the comparison the audit made is the
            // thing the associate is actually looking at.
            HStack(alignment: .top, spacing: 10) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Reference")
                        .font(.caption2.weight(.semibold)).foregroundColor(.secondary)
                    AsyncImage(url: URL(string: result.planogram.goldenImageURL)) { phase in
                        if case .success(let image) = phase {
                            image.resizable().aspectRatio(contentMode: .fit)
                        } else {
                            placeholderPanel("—")
                        }
                    }
                    .frame(height: 92)
                    .frame(maxWidth: .infinity)
                    .background(CopilotTheme.inset)
                    .cornerRadius(8)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text("Selected View")
                        .font(.caption2.weight(.semibold)).foregroundColor(.secondary)
                    Image(uiImage: result.capturedImage)
                        .resizable().scaledToFit()
                        .frame(height: 92)
                        .frame(maxWidth: .infinity)
                        .background(CopilotTheme.inset)
                        .cornerRadius(8)
                }
            }

            shelfMap(result)
            findings(result)
            behindTheScenes(result)
        }
        .padding(14)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    private func summaryRow(_ result: PlanogramAuditResult) -> some View {
        let flagged = result.flaggedCount
        let total = result.verdicts.count
        let ok = flagged == 0
        return HStack(spacing: 8) {
            Image(systemName: ok ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                .foregroundColor(ok ? CopilotTheme.compliant : CopilotTheme.degraded)
            Text(ok
                 ? "All \(total) products in compliance"
                 : "\(flagged) of \(total) products flagged")
                .font(.subheadline.weight(.semibold))
            Spacer()
        }
        .padding(10)
        .background(CopilotTheme.tint(ok ? CopilotTheme.compliant : CopilotTheme.degraded))
        .cornerRadius(9)
    }

    /// The grid as it sits on the shelf, each cell carrying the raw cosine distance to its
    /// nearest golden cell. Showing the number rather than only a colour is deliberate — it is
    /// what makes the threshold behaviour inspectable during a demo instead of a black box.
    ///
    /// Laid out one column per product, with the product named underneath, rather than as an
    /// anonymous row×col matrix. A shelf's tiers carry the same product top to bottom, so the
    /// column is the meaningful unit — and naming it means a flagged cell can be tied to a
    /// physical product without counting grid positions.
    private func shelfMap(_ result: PlanogramAuditResult) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("SHELF MAP (PER PRODUCT)")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            HStack(alignment: .top, spacing: 6) {
                ForEach(0..<result.grid.cols, id: \.self) { col in
                    let columnCells = result.cells
                        .filter { $0.col == col }
                        .sorted { $0.row < $1.row }
                    VStack(spacing: 3) {
                        ForEach(columnCells) { cell in
                            RoundedRectangle(cornerRadius: 5)
                                .fill(color(for: cell.status))
                                .frame(height: 30)
                                .overlay(
                                    Text(String(format: "%.2f", cell.distance))
                                        .font(.system(size: 10, weight: .semibold))
                                        .foregroundColor(.white)
                                )
                        }
                        Text(columnCells.first?.expectedProduct ?? "")
                            .font(.system(size: 9))
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                    }
                    .frame(maxWidth: .infinity)
                }
            }

            HStack(spacing: 12) {
                legend("In place", CopilotTheme.compliant)
                legend("Misplaced", CopilotTheme.degraded)
                legend("Empty", CopilotTheme.missing)
            }
            .padding(.top, 2)
        }
    }

    /// The column boundaries the audit will tile along, drawn over the preview so the geometry
    /// is something the viewer can see rather than take on trust.
    private func columnGuides(cols: Int) -> some View {
        GeometryReader { geo in
            if cols > 1 {
                Path { path in
                    for col in 1..<cols {
                        let x = geo.size.width * CGFloat(col) / CGFloat(cols)
                        path.move(to: CGPoint(x: x, y: 0))
                        path.addLine(to: CGPoint(x: x, y: geo.size.height))
                    }
                }
                .stroke(Color.white.opacity(0.5), lineWidth: 0.5)
            }
        }
    }

    /// What actually ran, in the open. The whole point of the demo is that this happened
    /// on-device against Couchbase Lite, and that claim is only convincing if the mechanism and
    /// the timing are visible rather than asserted.
    private func behindTheScenes(_ result: PlanogramAuditResult) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("BEHIND THE SCENES")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)
            Text("Model: CLIP ViT-B/32 (CoreML, on-device) · 512-d · cosine")
            Text("Tiled \(result.grid.rows)×\(result.grid.cols) → "
                 + "\(result.searches) cell embeddings")
            Text("Each cell → APPROX_VECTOR_DISTANCE over this shelf's golden PlanogramCell docs")
            Text(String(format: "Audit %.0f ms", result.elapsedMilliseconds))
        }
        .font(.caption2).foregroundColor(.secondary)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func legend(_ label: String, _ color: Color) -> some View {
        HStack(spacing: 4) {
            RoundedRectangle(cornerRadius: 2).fill(color).frame(width: 9, height: 9)
            Text(label).font(.caption2).foregroundColor(.secondary)
        }
    }

    private func color(for status: CellStatus?) -> Color {
        switch status {
        case .correct: return CopilotTheme.compliant
        case .misplaced: return CopilotTheme.degraded
        case .empty: return CopilotTheme.missing
        case nil: return CopilotTheme.inset
        }
    }

    /// One line per product (per grid column) — the unit the associate actually acts on.
    private func findings(_ result: PlanogramAuditResult) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("FINDINGS")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)

            ForEach(result.verdicts) { verdict in
                HStack(alignment: .top, spacing: 8) {
                    Image(systemName: verdict.ok
                          ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                        .foregroundColor(verdict.ok
                                         ? CopilotTheme.compliant : CopilotTheme.degraded)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(verdict.product.isEmpty ? "Unnamed position" : verdict.product)
                            .font(.caption.weight(verdict.ok ? .regular : .semibold))
                            .fixedSize(horizontal: false, vertical: true)
                        Text(verdict.note
                             + String(format: " · median d %.3f", verdict.medianDistance))
                            .font(.caption2).foregroundColor(.secondary)
                    }
                    Spacer(minLength: 0)
                }
                .padding(10)
                .background(CopilotTheme.tint(verdict.ok
                                              ? CopilotTheme.compliant : CopilotTheme.degraded))
                .cornerRadius(9)

                // The "Request Help" action is intentionally hidden for now. Review feedback was
                // to hide the resolution controls until the peer-to-peer task flow is demoable,
                // so the screen can be judged on the audit itself. `onRequestHelp` stays wired
                // up so this is a one-line restore rather than a rebuild.
            }
        }
    }

    // MARK: - Chrome

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Visual shelf audit").font(.headline)
            Text("No planogram documents in this store yet. They sync from the "
                 + "`planograms` collection, or are seeded from the bundled dataset on "
                 + "first launch.")
                .font(.caption).foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(CopilotTheme.surface)
        .cornerRadius(12)
    }

    private var auditingIndicator: some View {
        HStack(spacing: 10) {
            ProgressView()
            Text("Embedding each shelf cell on-device…")
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

    private func runAudit(image: UIImage, planogram: Planogram) {
        isAuditing = true
        errorMessage = nil
        result = nil
        Task {
            do {
                let audited = try await auditService.auditGrid(image: image,
                                                               planogram: planogram)
                await MainActor.run {
                    result = audited
                    isAuditing = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = "Audit failed: \(error.localizedDescription)"
                    isAuditing = false
                }
            }
        }
    }
}

/// Thin `UIImagePickerController` wrapper. The camera is unavailable in the Simulator, so it
/// falls back to the photo library rather than presenting an empty black sheet.
struct ShelfCameraPicker: UIViewControllerRepresentable {
    let onPicked: (UIImage?) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = UIImagePickerController.isSourceTypeAvailable(.camera)
            ? .camera : .photoLibrary
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_: UIImagePickerController, context _: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(onPicked: onPicked) }

    final class Coordinator: NSObject, UIImagePickerControllerDelegate,
                             UINavigationControllerDelegate {
        let onPicked: (UIImage?) -> Void
        init(onPicked: @escaping (UIImage?) -> Void) { self.onPicked = onPicked }

        func imagePickerController(
            _ picker: UIImagePickerController,
            didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]
        ) {
            onPicked(info[.originalImage] as? UIImage)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            onPicked(nil)
        }
    }
}
