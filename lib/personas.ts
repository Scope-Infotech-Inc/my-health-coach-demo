/**
 * Demo-control roster (from #spec-meta). This is demo chrome, not patient
 * display data — the persona switcher itself; all patient data renders from
 * /api/* responses. Display names come from GET /api/patients (SQLite).
 */
export const PERSONA_IDS = [
  'sarah',
  'maria',
  'robert',
  'jim',
  'priya',
  'hector',
  'linda',
  'deshawn',
  'samuel',
  'aisha',
  'carol',
  'miguel',
  'emily',
] as const;

export type PersonaId = (typeof PERSONA_IDS)[number];

export const PERSONA_GROUPS: { label: string; ids: PersonaId[] }[] = [
  { label: 'Featured', ids: ['sarah'] },
  { label: 'Diabetes', ids: ['maria', 'robert', 'jim', 'priya', 'hector', 'linda', 'deshawn'] },
  { label: 'Obesity', ids: ['samuel', 'aisha', 'carol', 'miguel', 'emily'] },
];

export const DEFAULT_PERSONA: PersonaId = 'sarah';

export function isPersonaId(v: string | null | undefined): v is PersonaId {
  return !!v && (PERSONA_IDS as readonly string[]).includes(v);
}
