import { LogDomain, LogLevel, LogSinks } from "@couchbase/couchbase-lite-react-native";

/**
 * Configures console logging for Couchbase Lite using the LogSinks API.
 * 
 * This sets up DEBUG level logging for all domains to help with development
 * and troubleshooting. The LogSinks API is the recommended approach for 
 * configuring logging in CBL 3.3+.
 * 
 * Features:
 * - Safe to call multiple times without conflicts
 * - Works seamlessly with database initialization logging
 * - Provides flexible configuration options
 * - Outputs logs to the console for easy debugging
 * 
 * Note: Logging is also configured in DatabaseService.initializeDatabase(),
 * so this function is optional if the database is initialized first.
 *
 * @returns {Promise<void>} A promise that resolves when logging is configured.
 * @throws Will throw an error if setting the log configuration fails.
 */
export async function startLogging(): Promise<void> {
	await LogSinks.setConsole({
		level: LogLevel.DEBUG,
		domains: [LogDomain.ALL]
	});
}