/**
 * Reads Capella App Services config from Vite env vars (`VITE_CBL_*`).
 *
 * Unlike the .NET MAUI / Java / Android ports — which read a runtime `.env`
 * shipped as an asset — Vite bakes these at build time, so changing them
 * means rebuilding. The same variable names (minus the VITE_ prefix) keep
 * the docs consistent across platforms.
 */
export interface EnvConfig {
  baseUrl: string;
  aaDb: string;
  nycDb: string;
  aaUser: string;
  nycUser: string;
  password: string;
}

export function loadEnv(): EnvConfig {
  const env = import.meta.env;
  return {
    baseUrl: env.VITE_CBL_BASE_URL ?? '',
    aaDb: env.VITE_CBL_AA_DB ?? 'supermarket-aa',
    nycDb: env.VITE_CBL_NYC_DB ?? 'supermarket-nyc',
    aaUser: env.VITE_CBL_AA_USER ?? '',
    nycUser: env.VITE_CBL_NYC_USER ?? '',
    password: env.VITE_CBL_PASSWORD ?? '',
  };
}

export function isEnvConfigured(env: EnvConfig): boolean {
  return Boolean(env.baseUrl && env.password);
}
