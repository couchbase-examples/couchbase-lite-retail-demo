namespace GroceryApp.Models;

public class AppServicesSyncState
{
    public bool IsConnected { get; init; }
    public string Status { get; init; } = "Disconnected";
    public DateTime? LastSyncTime { get; init; }
    public int DocumentsInSync { get; init; }
    public float Progress { get; init; }
    public string? Error { get; init; }
    public int TotalDocuments { get; init; }
    public int DocumentsCompleted { get; init; }

    public AppServicesSyncState With(
        bool? isConnected = null,
        string? status = null,
        DateTime? lastSyncTime = null,
        int? documentsInSync = null,
        float? progress = null,
        string? error = null,
        bool clearError = false,
        int? totalDocuments = null,
        int? documentsCompleted = null) => new()
    {
        IsConnected = isConnected ?? IsConnected,
        Status = status ?? Status,
        LastSyncTime = lastSyncTime ?? LastSyncTime,
        DocumentsInSync = documentsInSync ?? DocumentsInSync,
        Progress = progress ?? Progress,
        Error = clearError ? null : (error ?? Error),
        TotalDocuments = totalDocuments ?? TotalDocuments,
        DocumentsCompleted = documentsCompleted ?? DocumentsCompleted
    };
}
