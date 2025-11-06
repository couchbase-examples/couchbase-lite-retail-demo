type LogLevel = "trace" | "debug" | "info" | "warning" | "error" | "fatal";
export declare function initTestLogging(level?: LogLevel, category?: string | string[]): Promise<void>;
export {};
