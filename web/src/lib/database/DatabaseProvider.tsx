import type { RetailDatabase } from './types';
import { createContext, useContext, type ReactNode } from 'react';

export interface DatabaseContext {
  db: RetailDatabase;
}

export const DatabaseContext = createContext<DatabaseContext | null>(null);

export function DatabaseProvider({
  db,
  children,
}: {
  db: RetailDatabase;
  children: ReactNode;
}) {
  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider!');
  }
  return context.db;
}
