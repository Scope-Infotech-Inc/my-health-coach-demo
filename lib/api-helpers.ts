import { NextResponse } from 'next/server';
import type Database from 'better-sqlite3';
import { getDb } from './db';

/** Conventions per #spec-api: JSON; 404 unknown patient; { error } shape. */

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export interface PatientRow {
  id: string;
  first_name: string;
  last_name_initial: string;
  age: number;
  category: string;
  featured: number;
  plan_type: string;
  condition_detail: string | null;
  medicare_context: string;
  dual_eligible: number;
  sex: string | null;
  preferred_language: string;
  race_ethnicity: string | null;
  rurality: string | null;
  allergies: string | null;
  dietary_prefs: string | null;
  provider_org: string;
  avatar_initials: string;
}

/** Look up a patient or return null (caller 404s via unknownPatient()). */
export function findPatient(id: string): PatientRow | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as PatientRow | undefined;
  return row ?? null;
}

export function unknownPatient(id: string): NextResponse {
  return jsonError(`Unknown patient: ${id}`, 404);
}

/**
 * Presentation-shaped seed values the schema does not model relationally
 * (tiles, riskScale, glucose14d metadata, timeInRange, bpTrend, nutrition
 * rows, adherence labels, …) live verbatim in app_meta as persona_raw:{id}.
 */
export function readPersonaRaw<T = Record<string, unknown>>(id: string): T | null {
  return readAppMetaJson<T>(`persona_raw:${id}`);
}

export function readAppMetaJson<T>(key: string): T | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM app_meta WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

export function readAppMetaText(key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM app_meta WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

/** Simulated latency (deterministic — pair with seededJitterMs). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Safe JSON.parse for TEXT columns holding JSON arrays ('[]' fallback). */
export function parseJsonArray<T = unknown>(text: string | null | undefined): T[] {
  if (!text) return [];
  try {
    const v = JSON.parse(text);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export type Db = Database.Database;
