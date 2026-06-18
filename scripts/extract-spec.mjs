#!/usr/bin/env node
/**
 * Extracts the machine-readable spec blocks and normative prose from the PRD.
 *
 * PROHIBITED CONTENT RULE: PRD §15 (lines containing the embedded prototype
 * sources #src-prototype-mobile / #src-prototype-desktop) must never be
 * extracted, printed, or written anywhere. This script slices the file by
 * section boundaries and asserts no prototype markup leaks into any output.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'Docs/spec/hteap-demo-app-prd.html';
const OUT = 'spec-extracted';
mkdirSync(OUT, { recursive: true });

const html = readFileSync(SRC, 'utf8');

// --- Hard boundary: everything from <section id="s15"> to <section id="s16"> is forbidden.
const s15Start = html.indexOf('<section class="s" id="s15">');
const s16Start = html.indexOf('<section class="s" id="s16">');
if (s15Start === -1 || s16Start === -1 || s16Start < s15Start) {
  throw new Error('Could not locate section boundaries s15/s16');
}
const safeHead = html.slice(0, s15Start); // §0–§14
const safeTail = html.slice(s16Start); // §16

// Safety is guaranteed by construction (slices exclude [s15Start, s16Start)).
// This check guards against actual embedded prototype documents — not mere
// textual references to the block IDs, which the meta/prose legitimately make.
function assertClean(name, text) {
  for (const marker of ['<!DOCTYPE html', '&lt;!DOCTYPE html', '<iframe class="proto-frame"']) {
    if (text.includes(marker)) throw new Error(`PROHIBITED content marker leaked into ${name}`);
  }
}

// --- JSON blocks from §16 (script tags hold raw JSON, no entity decoding needed)
function extractJson(id) {
  const re = new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`);
  const m = safeTail.match(re);
  if (!m) throw new Error(`JSON block #${id} not found in §16`);
  const raw = m[1].trim();
  const parsed = JSON.parse(raw); // validate
  assertClean(id, raw);
  writeFileSync(join(OUT, `${id}.json`), JSON.stringify(parsed, null, 2) + '\n');
  return parsed;
}

const meta = extractJson('spec-meta');
const reqs = extractJson('spec-requirements');
const tokens = extractJson('spec-design-tokens');
const api = extractJson('spec-api');
const seed = extractJson('spec-seed-data');

// --- SQL DDL from §10 (inside safeHead; entity-encoded inside <pre><code>)
function decodeEntities(s) {
  return s
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&'); // last
}
const ddlMatch = safeHead.match(/<pre id="sql-ddl"><code>([\s\S]*?)<\/code><\/pre>/);
if (!ddlMatch) throw new Error('#sql-ddl not found in §10');
const ddl = decodeEntities(ddlMatch[1]);
assertClean('sql-ddl', ddl);
writeFileSync(join(OUT, 'schema.sql'), ddl.trimEnd() + '\n');

// --- Normative prose §0–§14: strip tags to readable text
function htmlToText(s) {
  return decodeEntities(
    s
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(
        /<pre id="sql-ddl"><code>[\s\S]*?<\/code><\/pre>/,
        '\n[SQL DDL extracted separately to schema.sql]\n'
      )
      .replace(/<(h[1-6])[^>]*>/g, '\n\n## ')
      .replace(/<\/(h[1-6])>/g, '\n')
      .replace(/<li[^>]*>/g, '\n- ')
      .replace(/<\/(p|div|section|tr|table|ul|ol|blockquote)>/g, '\n')
      .replace(/<(td|th)[^>]*>/g, ' | ')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
  ).trim();
}
const prose = htmlToText(safeHead);
assertClean('prd-prose', prose);
writeFileSync(join(OUT, 'prd-prose.md'), prose + '\n');

// --- Summary (counts only)
const summary = {
  meta: Object.keys(meta),
  requirements: Array.isArray(reqs) ? reqs.length : Object.keys(reqs),
  tokenGroups: Object.keys(tokens),
  api: Array.isArray(api) ? api.length : Object.keys(api),
  seedTopLevel: Object.keys(seed),
  ddlTables: (ddl.match(/CREATE TABLE/g) || []).length,
  proseChars: prose.length,
};
console.log(JSON.stringify(summary, null, 2));
