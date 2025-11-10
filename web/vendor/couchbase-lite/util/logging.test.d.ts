import * as logtape from "@logtape/logtape";
type LogLevel = "trace" | "debug" | "info" | "warning" | "error" | "fatal";
export declare function initTestLogging(level?: LogLevel, category?: string | string[]): Promise<logtape.Logger>;
export {};
