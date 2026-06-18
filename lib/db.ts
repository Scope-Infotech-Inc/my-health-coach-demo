import Database from 'better-sqlite3';
import { dbDir, dbPath, ensureDir } from './paths';

/**
 * Singleton SQLite handle (better-sqlite3, synchronous). API routes import
 * this; every route that does runs on the Node runtime (no edge).
 * Survives Next dev hot-reload via globalThis.
 */
declare global {
  // eslint-disable-next-line no-var
  var __hteapDb: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!globalThis.__hteapDb) {
    ensureDir(dbDir);
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    globalThis.__hteapDb = db;
  }
  return globalThis.__hteapDb;
}

/** Close and forget the singleton (used by demo reset before re-seeding). */
export function closeDb(): void {
  if (globalThis.__hteapDb) {
    globalThis.__hteapDb.close();
    globalThis.__hteapDb = undefined;
  }
}
