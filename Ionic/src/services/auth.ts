import { AppConfig, LOCAL_DB_NAME } from '../models/AppConfig';
import { User } from '../models/User';
import { loadEnv } from './envLoader';

export interface LoginResult {
  success: boolean;
  errorMessage?: string;
  user?: User;
  config?: AppConfig;
}

/**
 * Validates demo credentials against the build-time env, derives the user's
 * store from the username prefix, and builds an `AppConfig` ready for the
 * `DatabaseService`. Stateless — UI keeps the current user in React state.
 */
export function login(username: string, password: string): LoginResult {
  if (!username?.trim() || !password) {
    return { success: false, errorMessage: 'Username and password are required' };
  }
  const env = loadEnv();
  if (!env.password) {
    return {
      success: false,
      errorMessage: 'Capella config missing — populate .env.local first',
    };
  }
  if (env.password !== password) {
    return { success: false, errorMessage: 'Invalid credentials' };
  }
  if (!env.baseUrl) {
    return { success: false, errorMessage: 'VITE_CBL_BASE_URL is not configured' };
  }

  const u = username.toLowerCase();
  let store: 'AA' | 'NYC';
  let dbName: string;
  if (u === env.aaUser.toLowerCase() || u.startsWith('aa-')) {
    store = 'AA';  dbName = env.aaDb;
  } else if (u === env.nycUser.toLowerCase() || u.startsWith('nyc-')) {
    store = 'NYC'; dbName = env.nycDb;
  } else {
    return {
      success: false,
      errorMessage: 'Unknown user — must match VITE_CBL_AA_USER or VITE_CBL_NYC_USER',
    };
  }

  const syncUrl = env.baseUrl.replace(/\/+$/, '') + '/' + dbName;
  const scope = store === 'AA' ? 'AA-Store' : 'NYC-Store';

  return {
    success: true,
    user: { username, store, role: 'Store Manager' },
    config: {
      store, scope, syncUrl,
      databaseName: LOCAL_DB_NAME,
      username, password,
    },
  };
}
