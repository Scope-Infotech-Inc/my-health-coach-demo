import path from 'node:path';
import fs from 'node:fs';

/**
 * All runtime file storage lives under one base directory (PRD §9).
 * Default: <cwd>/Output. Override with HTEAP_OUTPUT_DIR.
 * Code MUST NOT read or write outside this tree at runtime.
 */
export const outputDir: string = process.env.HTEAP_OUTPUT_DIR
  ? path.resolve(process.env.HTEAP_OUTPUT_DIR)
  : path.resolve(process.cwd(), 'Output');

export const dbDir = path.join(outputDir, 'db');
export const documentsDir = path.join(outputDir, 'documents');
export const exportsDir = path.join(outputDir, 'exports');
export const uploadsDir = path.join(outputDir, 'uploads');
export const logsDir = path.join(outputDir, 'logs');

export const dbPath = path.join(dbDir, 'hteap-demo.db');

/** Create a directory under Output/ on demand (idempotent). */
export function ensureDir(dir: string): string {
  if (!dir.startsWith(outputDir)) {
    throw new Error(`Refusing to create directory outside Output/: ${dir}`);
  }
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function ensureOutputTree(): void {
  for (const dir of [dbDir, documentsDir, exportsDir, uploadsDir, logsDir]) {
    ensureDir(dir);
  }
}
