/**
 * `npm run seed` — rebuild Output/db/hteap-demo.db from scratch.
 *
 * Deletes the existing DB file (and -wal/-shm sidecars) first so every run
 * produces a byte-identical file (verified by the printed sha256). Uses its
 * own short-lived better-sqlite3 connection — NOT the lib/db singleton — and
 * leaves the default rollback journal (no WAL) so the on-disk state is stable.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';
import { ensureOutputTree, dbPath } from '../lib/paths';
import { runSeed } from '../lib/seed/seed';

function main(): void {
  ensureOutputTree();

  for (const file of [dbPath, `${dbPath}-wal`, `${dbPath}-shm`]) {
    fs.rmSync(file, { force: true });
  }

  const db = new Database(dbPath);
  try {
    db.pragma('journal_mode = DELETE'); // deterministic file state (no WAL in the seed connection)
    runSeed(db);

    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      )
      .all() as { name: string }[];
    let total = 0;
    console.log(`Seeded ${dbPath}`);
    for (const { name } of tables) {
      const { c } = db.prepare(`SELECT COUNT(*) AS c FROM ${name}`).get() as { c: number };
      total += c;
      console.log(`  ${name.padEnd(24)} ${String(c).padStart(5)}`);
    }
    console.log(
      `  ${'TOTAL'.padEnd(24)} ${String(total).padStart(5)} rows across ${tables.length} tables`
    );
  } finally {
    db.close();
  }

  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(dbPath)).digest('hex');
  console.log(`sha256 ${sha256}`);
}

main();
