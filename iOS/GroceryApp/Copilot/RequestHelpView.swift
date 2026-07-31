import SwiftUI

/// Raises a Request Help task from a shelf-audit finding.
///
/// The task document syncs to every device in the store scope automatically — App Services
/// when online, peer-to-peer when offline — because all devices share the store credential.
/// No new users, roles or channels are involved.
struct RequestHelpView: View {
    let finding: PositionFinding
    let planogram: Planogram
    @ObservedObject var taskService: TaskService
    /// Called on dismiss only when a task was actually created, so the caller can show it.
    var onDismissAfterCreating: (() -> Void)?

    @Environment(\.dismiss) private var dismiss

    @State private var taskType = "relocate"
    @State private var priority = "normal"
    @State private var title: String = ""
    @State private var detail: String = ""
    @State private var assignTo = ""
    @State private var created: StoreTask?

    private let accent = Color(hex: "FC9C0C")

    var body: some View {
        NavigationView {
            Form {
                if let created {
                    Section {
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Task created", systemImage: "checkmark.circle.fill")
                                .font(.subheadline.weight(.semibold))
                                .foregroundColor(.green)
                            Text(created.id)
                                .font(.caption2.monospaced())
                                .foregroundColor(.secondary)
                            Text("It is now on every device signed in to this store — over "
                                 + "App Services if online, or peer-to-peer if not.")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                } else {
                    Section("What the audit found") {
                        Text(finding.summary)
                            .font(.caption)
                            .fixedSize(horizontal: false, vertical: true)
                        HStack {
                            Text("Location").font(.caption).foregroundColor(.secondary)
                            Spacer()
                            Text("Aisle \(planogram.aisle) · shelf \(planogram.shelf) · \(finding.position)")
                                .font(.caption)
                        }
                        HStack {
                            Text("Confidence").font(.caption).foregroundColor(.secondary)
                            Spacer()
                            Text(finding.confidence)
                                .font(.caption)
                                .foregroundColor(finding.confidence == "low" ? .orange : .secondary)
                        }
                    }

                    Section("Task") {
                        Picker("Type", selection: $taskType) {
                            ForEach(StoreTask.types, id: \.self) {
                                Text($0.capitalized).tag($0)
                            }
                        }
                        Picker("Priority", selection: $priority) {
                            Text("Low").tag("low")
                            Text("Normal").tag("normal")
                            Text("High").tag("high")
                        }
                        TextField("Title", text: $title)
                            .font(.callout)
                        TextField("Details", text: $detail, axis: .vertical)
                            .lineLimit(2...5)
                            .font(.callout)
                    }

                    Section {
                        TextField("Assign to (optional)", text: $assignTo)
                            .font(.callout)
                            .autocorrectionDisabled()
                    } header: {
                        Text("Assignee")
                    } footer: {
                        Text("A display label, not a login. Leave it empty so any associate "
                             + "can pick the task up. Created by \(TaskService.deviceLabel).")
                    }
                }
            }
            .navigationTitle(created == nil ? "Request Help" : "Help Requested")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button(created == nil ? "Cancel" : "Done") {
                        if created != nil { onDismissAfterCreating?() }
                        dismiss()
                    }
                }
                if created == nil {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Create") { create() }
                            .fontWeight(.semibold)
                            .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
                    }
                }
            }
            .onAppear(perform: prefill)
        }
    }

    /// Pre-fills from the finding so the common case is one tap. The associate is correcting
    /// a shelf, not writing a ticket.
    private func prefill() {
        guard title.isEmpty else { return }
        if finding.isCompliant {
            title = "Check \(finding.expectedName) at \(finding.position)"
            detail = "Shelf \(planogram.shelf) position \(finding.position) looks correct but "
                   + "was flagged for review."
        } else {
            title = "Move \(finding.expectedName) back to \(finding.position)"
            let found = finding.foundName ?? "another product"
            detail = "Shelf audit of aisle \(planogram.aisle) shelf \(planogram.shelf) expected "
                   + "\(finding.expectedName) at \(finding.position) with "
                   + "\(finding.expectedFacings) facings, but found \(found) there. "
                   + "Please bring \(finding.expectedName) forward to eye level and restore "
                   + "its facings."
        }
    }

    private func create() {
        created = taskService.createTask(
            from: finding,
            planogram: planogram,
            taskType: taskType,
            priority: priority,
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            detail: detail.trimmingCharacters(in: .whitespacesAndNewlines),
            assignedTo: assignTo.trimmingCharacters(in: .whitespacesAndNewlines)
        )
    }
}
