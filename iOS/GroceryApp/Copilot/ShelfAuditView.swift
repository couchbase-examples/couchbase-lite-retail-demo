import SwiftUI
import UIKit

/// Step 2 — the visual shelf audit.
///
/// The associate picks a shelf, photographs it, and gets a per-position verdict. Everything
/// runs on-device: CLIP embeds each cropped position, and Couchbase Lite matches it against
/// the product-image vectors with `APPROX_VECTOR_DISTANCE`.
struct ShelfAuditView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @ObservedObject var auditService: ShelfAuditService
    /// Raising a Request Help task is Step 2's natural next action, so it is handed back up
    /// rather than duplicated here.
    let onRequestHelp: (PositionFinding, Planogram) -> Void

    @State private var selected: Planogram?
    @State private var result: ShelfAuditResult?
    @State private var isAuditing = false
    @State private var errorMessage: String?
    @State private var showCamera = false

    private let accent = Color(hex: "FC9C0C")

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            if auditService.planograms.isEmpty {
                emptyState
            } else {
                shelfPicker
                if let selected { captureCard(for: selected) }
                if isAuditing { auditingIndicator }
                if let errorMessage { errorBanner(errorMessage) }
                if let result, !isAuditing { resultsCard(result) }
            }
        }
        .onAppear {
            auditService.loadPlanograms()
            if selected == nil { selected = auditService.planograms.first }
        }
        .sheet(isPresented: $showCamera) {
            ShelfCameraPicker { image in
                showCamera = false
                if let image, let selected { runAudit(image: image, planogram: selected) }
            }
        }
    }

    // MARK: - Shelf selection

    private var shelfPicker: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("SHELF TO AUDIT")
                .font(.caption2.weight(.bold)).foregroundColor(.secondary)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(auditService.planograms) { planogram in
                        Button {
                            selected = planogram
                            result = nil
                            errorMessage = nil
                        } label: {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Aisle \(planogram.aisle) · \(planogram.shelf)")
                                    .font(.caption.weight(.semibold))
                                Text(planogram.section)
                                    .font(.caption2)
                                    .foregroundColor(selected?.id == planogram.id
                                                     ? .white.opacity(0.85) : .secondary)
                            }
                            .padding(.horizontal, 12).padding(.vertical, 8)
                            .background(selected?.id == planogram.id
                                        ? accent : Color(UIColor.systemBackground))
                            .foregroundColor(selected?.id == planogram.id ? .white : .primary)
                            .cornerRadius(8)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }

    // MARK: - Capture

    private func captureCard(for planogram: Planogram) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Expecting \(planogram.expectedLayout.count) positions: "
                 + planogram.expectedLayout.map(\.position).joined(separator: ", "))
                .font(.caption).foregroundColor(.secondary)

            Button {
                showCamera = true
            } label: {
                HStack {
                    Image(systemName: "camera.fill")
                    Text("Photograph this shelf").fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity).padding(.vertical, 11)
                .background(accent).foregroundColor(.white).cornerRadius(10)
            }

            // The dataset's real shelf photos do not exist yet and the Simulator has no
            // camera, so the bundled renders are what make this demonstrable today.
            VStack(alignment: .leading, spacing: 6) {
                Text("OR USE A SAMPLE SHELF IMAGE")
                    .font(.caption2.weight(.bold)).foregroundColor(.secondary)
                HStack(spacing: 8) {
                    sampleButton("Correct layout", variant: "golden", planogram: planogram,
                                 icon: "checkmark.seal")
                    sampleButton("Disorganised", variant: "messy", planogram: planogram,
                                 icon: "exclamationmark.triangle")
                }
                Text("Placeholder renders, not photographs — the shelf imagery the dataset "
                     + "refers to has not been produced yet.")
                    .font(.caption2).foregroundColor(.secondary)
            }
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private func sampleButton(_ title: String, variant: String,
                              planogram: Planogram, icon: String) -> some View {
        Button {
            let store = AppConfig.currentStore == .nyc ? "nyc" : "aa"
            if let image = ShelfAuditService.bundledShelfImage(
                store: store, shelf: planogram.shelf, variant: variant) {
                runAudit(image: image, planogram: planogram)
            } else {
                errorMessage = "Sample image \(store)_\(planogram.shelf)_\(variant).png "
                             + "is not in the app bundle."
            }
        } label: {
            HStack(spacing: 5) {
                Image(systemName: icon).font(.caption2)
                Text(title).font(.caption.weight(.medium))
            }
            .frame(maxWidth: .infinity).padding(.vertical, 9)
            .background(accent.opacity(0.14)).foregroundColor(.primary).cornerRadius(8)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Results

    private func resultsCard(_ result: ShelfAuditResult) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            Image(uiImage: result.capturedImage)
                .resizable().scaledToFit()
                .frame(maxWidth: .infinity)
                .cornerRadius(10)
                .overlay(alignment: .bottom) { positionOverlay(result) }

            HStack(spacing: 14) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(result.compliancePercent)%")
                        .font(.title2.weight(.bold))
                        .foregroundColor(result.violations.isEmpty ? .green : .orange)
                    Text("positions correct").font(.caption2).foregroundColor(.secondary)
                }
                Divider().frame(height: 32)
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(result.compliantCount)/\(result.findings.count)")
                        .font(.title3.weight(.semibold))
                    Text("as planned").font(.caption2).foregroundColor(.secondary)
                }
                if let similarity = result.shelfSimilarityPercent {
                    Divider().frame(height: 32)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(similarity)%").font(.title3.weight(.semibold))
                        Text("vs golden").font(.caption2).foregroundColor(.secondary)
                    }
                }
            }

            ForEach(result.findings) { finding in
                findingRow(finding, planogram: result.planogram)
            }

            Text(String(format: "On-device: %.0f ms embedding %d crops · %.1f ms vector search",
                        result.embedMilliseconds, result.findings.count,
                        result.searchMilliseconds))
                .font(.caption2.monospaced()).foregroundColor(.secondary)
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    /// Labels each cropped band under the photo so the geometry the audit used is visible,
    /// rather than the user having to trust an invisible split.
    private func positionOverlay(_ result: ShelfAuditResult) -> some View {
        HStack(spacing: 0) {
            ForEach(result.findings) { finding in
                Text(finding.position)
                    .font(.caption2.weight(.bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 4)
                    .background((finding.isCompliant ? Color.green : Color.red).opacity(0.85))
            }
        }
    }

    private func findingRow(_ finding: PositionFinding, planogram: Planogram) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: finding.isCompliant
                      ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                    .foregroundColor(finding.isCompliant ? .green : .orange)
                VStack(alignment: .leading, spacing: 3) {
                    Text(finding.summary)
                        .font(.caption.weight(finding.isCompliant ? .regular : .semibold))
                        .fixedSize(horizontal: false, vertical: true)
                    HStack(spacing: 6) {
                        Text("distance \(String(format: "%.4f", finding.distance))")
                            .font(.caption2.monospaced())
                        Text("·").font(.caption2)
                        Text("\(finding.confidence) confidence")
                            .font(.caption2)
                            .foregroundColor(finding.confidence == "low" ? .orange : .secondary)
                        Text("·").font(.caption2)
                        Text("expects \(finding.expectedFacings) facings").font(.caption2)
                    }
                    .foregroundColor(.secondary)
                }
                Spacer(minLength: 0)
            }

            if !finding.isCompliant {
                Button {
                    onRequestHelp(finding, planogram)
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: "person.badge.plus").font(.caption2)
                        Text("Request Help").font(.caption.weight(.semibold))
                    }
                    .padding(.horizontal, 10).padding(.vertical, 6)
                    .background(accent).foregroundColor(.white).cornerRadius(7)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(10)
        .background(finding.isCompliant
                    ? Color.green.opacity(0.06) : Color.orange.opacity(0.10))
        .cornerRadius(9)
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
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var auditingIndicator: some View {
        HStack(spacing: 10) {
            ProgressView()
            Text("Embedding each shelf position on-device…")
                .font(.caption).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 18)
    }

    private func errorBanner(_ message: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill").foregroundColor(.orange)
            Text(message).font(.caption).fixedSize(horizontal: false, vertical: true)
            Spacer()
            Button { errorMessage = nil } label: {
                Image(systemName: "xmark").font(.caption2).foregroundColor(.secondary)
            }
        }
        .padding(12).background(Color.orange.opacity(0.12)).cornerRadius(10)
    }

    // MARK: - Actions

    private func runAudit(image: UIImage, planogram: Planogram) {
        isAuditing = true
        errorMessage = nil
        result = nil
        Task {
            do {
                let audited = try await auditService.audit(image: image, against: planogram)
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
