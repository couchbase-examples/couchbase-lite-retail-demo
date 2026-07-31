import SwiftUI

/// The other half of Request Help: what the *second* associate sees.
///
/// Raising a task was already possible from the shelf audit; this is where someone else picks
/// it up, corrects the stock count and closes it out. The whole lifecycle runs against the
/// local database, so it works with no network and reconciles when sync returns.
///
/// Two details are worth pointing at during a demo:
///
///  - The list is driven by a change listener on the `tasks` collection, so a task raised on
///    another device appears here on its own. Nothing polls.
///  - Correcting the count writes a plain `stockQty` to inventory (what Capella and Android
///    read) *and* a PN-counter delta onto the task, so two associates restocking the same
///    request sum rather than clobber each other.
struct TaskListView: View {
    @ObservedObject var taskService: TaskService

    @State private var showFinished = false

    private let accent = Color(hex: "FC9C0C")
    private let cream = Color(hex: "FFF0DB")

    private var open: [StoreTask] { taskService.tasks.filter { $0.status == "open" } }
    private var active: [StoreTask] {
        taskService.tasks.filter { $0.status == "accepted" || $0.status == "in_progress" }
    }
    private var finished: [StoreTask] { taskService.tasks.filter(\.isTerminal) }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            header

            if taskService.tasks.isEmpty {
                emptyState
            } else {
                if !open.isEmpty {
                    section("Needs an associate", count: open.count, tint: accent)
                    ForEach(open) { card($0) }
                }
                if !active.isEmpty {
                    section("Being worked on", count: active.count, tint: .blue)
                    ForEach(active) { card($0) }
                }
                if !finished.isEmpty {
                    Button { withAnimation { showFinished.toggle() } } label: {
                        HStack(spacing: 6) {
                            Image(systemName: showFinished ? "chevron.down" : "chevron.right")
                                .font(.caption2)
                            Text("\(finished.count) finished")
                                .font(.caption.weight(.semibold))
                            Spacer()
                        }
                        .foregroundColor(.secondary)
                    }
                    .buttonStyle(.plain)
                    if showFinished {
                        ForEach(finished) { card($0) }
                    }
                }
            }
        }
    }

    // MARK: - Chrome

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Store tasks").font(.headline)
                Spacer()
                Text("you are \(TaskService.deviceLabel)")
                    .font(.caption2.monospaced())
                    .foregroundColor(.secondary)
            }
            Text("Every device signed in to this store sees the same tasks — over App Services "
                 + "when online, peer-to-peer when not. Accepting one claims it under this "
                 + "device's label.")
                .font(.caption)
                .foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            if let changed = taskService.lastRemoteChange {
                HStack(spacing: 6) {
                    Image(systemName: "arrow.triangle.2.circlepath")
                        .font(.caption2).foregroundColor(.blue)
                    Text("Updated from another device \(relative(changed))")
                        .font(.caption2.weight(.medium))
                    Spacer()
                }
                .padding(8)
                .background(Color.blue.opacity(0.12))
                .cornerRadius(8)
            }
        }
        .padding(14)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("No tasks yet", systemImage: "checkmark.circle")
                .font(.subheadline.weight(.semibold))
            Text("Run a shelf audit on the Planogram tab and tap Request Help on a finding. "
                 + "The task will show up here, and on every other device in this store.")
                .font(.caption)
                .foregroundColor(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    private func section(_ title: String, count: Int, tint: Color) -> some View {
        HStack(spacing: 6) {
            Text(title.uppercased())
                .font(.caption2.weight(.bold))
                .foregroundColor(.secondary)
            Text("\(count)")
                .font(.caption2.weight(.bold))
                .padding(.horizontal, 6).padding(.vertical, 1)
                .background(tint.opacity(0.18))
                .cornerRadius(4)
            Spacer()
        }
        .padding(.top, 4)
    }

    private func card(_ task: StoreTask) -> some View {
        TaskCard(task: task, taskService: taskService, accent: accent, cream: cream)
    }

    private func relative(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Card

private struct TaskCard: View {
    let task: StoreTask
    @ObservedObject var taskService: TaskService
    let accent: Color
    let cream: Color

    @State private var showCountEditor = false
    @State private var draftCount: Int?
    @State private var stock: TaskStockContext?
    @State private var applied = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .top, spacing: 8) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(task.title)
                        .font(.subheadline.weight(.semibold))
                        .fixedSize(horizontal: false, vertical: true)
                    HStack(spacing: 4) {
                        badge(task.taskType.capitalized, tint: accent)
                        if task.priority != "normal" {
                            badge(task.priority.capitalized,
                                  tint: task.priority == "high" ? .red : .gray)
                        }
                        badge(statusLabel, tint: statusTint)
                    }
                }
                Spacer(minLength: 0)
            }

            if !task.detail.isEmpty {
                Text(task.detail)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if let location = task.locationText {
                HStack(spacing: 4) {
                    Image(systemName: "mappin.and.ellipse")
                        .font(.caption2).foregroundColor(accent)
                    Text(location).font(.caption.weight(.medium))
                }
            }

            HStack(spacing: 6) {
                Text("raised by \(task.createdBy)")
                    .font(.caption2).foregroundColor(.secondary)
                if let assignedTo = task.assignedTo {
                    Text("→").font(.caption2).foregroundColor(.secondary)
                    Text(task.isMine ? "you" : assignedTo)
                        .font(.caption2.weight(.semibold))
                        .foregroundColor(task.isMine ? accent : .secondary)
                }
                Spacer()
            }

            if task.quantityDelta != 0 {
                HStack(spacing: 4) {
                    Image(systemName: "shippingbox.fill")
                        .font(.caption2).foregroundColor(.green)
                    Text("\(task.quantityDelta > 0 ? "+" : "")\(task.quantityDelta) recorded "
                         + "against stock")
                        .font(.caption2.weight(.medium))
                    Text("(pn-counter)")
                        .font(.caption2.monospaced()).foregroundColor(.secondary)
                }
            }

            if showCountEditor { countEditor }

            actions
        }
        .padding(12)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
    }

    // MARK: Count editor

    private var countEditor: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let stock {
                Text(stock.name)
                    .font(.caption.weight(.semibold))
                HStack {
                    Text("On shelf now").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text("\(stock.currentStock)").font(.caption.monospaced())
                }
                Stepper(value: Binding(
                    get: { draftCount ?? stock.currentStock },
                    set: { draftCount = $0 }
                ), in: 0...9999) {
                    HStack {
                        Text("Corrected count").font(.caption)
                        Spacer()
                        Text("\(draftCount ?? stock.currentStock)")
                            .font(.caption.monospaced().weight(.semibold))
                    }
                }
                Button {
                    if taskService.applyStockCount(for: task,
                                                   newCount: draftCount ?? stock.currentStock) {
                        applied = true
                        showCountEditor = false
                        draftCount = nil
                        self.stock = taskService.stockContext(for: task)
                    }
                } label: {
                    Text("Save count")
                        .font(.caption.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(accent)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                .buttonStyle(.plain)
                .disabled((draftCount ?? stock.currentStock) == stock.currentStock)
            } else {
                Text("This task is not linked to a product in this store's inventory, so there "
                     + "is no count to correct.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(10)
        .background(cream)
        .cornerRadius(8)
    }

    // MARK: Actions

    private var actions: some View {
        HStack(spacing: 8) {
            if let label = task.nextStatusLabel {
                Button { taskService.advance(task) } label: {
                    Text(label)
                        .font(.caption.weight(.semibold))
                        .padding(.horizontal, 12).padding(.vertical, 7)
                        .background(accent)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                .buttonStyle(.plain)
            }

            if !task.isTerminal && task.relatedProductId != nil {
                Button {
                    if stock == nil { stock = taskService.stockContext(for: task) }
                    withAnimation { showCountEditor.toggle() }
                } label: {
                    HStack(spacing: 3) {
                        Image(systemName: "plusminus")
                        Text(applied ? "Count saved" : "Update count")
                    }
                    .font(.caption.weight(.semibold))
                    .padding(.horizontal, 10).padding(.vertical, 7)
                    .background(accent.opacity(0.16))
                    .foregroundColor(.primary)
                    .cornerRadius(8)
                }
                .buttonStyle(.plain)
            }

            Spacer()

            if !task.isTerminal {
                Menu {
                    if task.assignedTo != nil {
                        Button("Put back in the pool") { taskService.release(task) }
                    }
                    Button("Cancel task", role: .destructive) { taskService.cancel(task) }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(.secondary)
                }
            }
        }
    }

    // MARK: Bits

    private var statusLabel: String {
        task.status == "in_progress" ? "In progress" : task.status.capitalized
    }

    private var statusTint: Color {
        switch task.status {
        case "open": return .orange
        case "accepted": return .blue
        case "in_progress": return .purple
        case "done": return .green
        default: return .gray
        }
    }

    private func badge(_ text: String, tint: Color) -> some View {
        Text(text)
            .font(.caption2.weight(.medium))
            .padding(.horizontal, 6).padding(.vertical, 2)
            .background(tint.opacity(0.16))
            .foregroundColor(.primary.opacity(0.8))
            .cornerRadius(4)
    }
}
