/**
 * In-process API smoke test. Run with an ISOLATED database copy:
 *   HTEAP_OUTPUT_DIR=/tmp/hteap-smoke npm run seed
 *   HTEAP_OUTPUT_DIR=/tmp/hteap-smoke npx tsx scripts/smoke-api.ts
 * Invokes every route handler directly (no server) and checks status +
 * top-level shape against #spec-api. Exits non-zero on any failure.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Handler = (
  req: Request,
  ctx: { params: Promise<Record<string, string>> }
) => Promise<Response>;

interface Check {
  name: string;
  route: string; // module path under app/api
  method: 'GET' | 'POST';
  params?: Record<string, string>;
  url?: string;
  body?: unknown;
  expectStatus?: number;
  expectKeys?: string[];
  validate?: (json: any) => string | null; // return error string or null
}

const PERSONAS = ['sarah', 'maria', 'robert', 'priya', 'emily'];

function patientChecks(id: string): Check[] {
  return [
    {
      name: `overview:${id}`,
      route: 'patients/[id]/overview',
      method: 'GET',
      params: { id },
      expectKeys: ['patient', 'demoToday', 'tiles'],
      validate: (j) =>
        Array.isArray(j.tiles) && j.tiles.length === 5 ? null : `tiles len ${j.tiles?.length}`,
    },
    {
      name: `labs:${id}`,
      route: 'patients/[id]/labs',
      method: 'GET',
      params: { id },
      expectKeys: ['labs', 'a1cSeries'],
    },
    {
      name: `observations:${id}`,
      route: 'patients/[id]/observations',
      method: 'GET',
      params: { id },
      url: `http://x/api/patients/${id}/observations?type=steps`,
      expectKeys: ['series'],
    },
    {
      name: `medications:${id}`,
      route: 'patients/[id]/medications',
      method: 'GET',
      params: { id },
      expectKeys: ['medications', 'refills', 'adherence'],
    },
    {
      name: `nutrition:${id}`,
      route: 'patients/[id]/nutrition',
      method: 'GET',
      params: { id },
      expectKeys: ['rows'],
      validate: (j) => (j.rows.length > 0 ? null : 'empty nutrition rows'),
    },
    {
      name: `messages:${id}`,
      route: 'patients/[id]/messages',
      method: 'GET',
      params: { id },
      expectKeys: ['messages'],
      validate: (j) => (j.messages.length > 0 ? null : 'empty messages'),
    },
    {
      name: `programs:${id}`,
      route: 'patients/[id]/programs',
      method: 'GET',
      params: { id },
      expectKeys: ['programs'],
      validate: (j) => (j.programs.length > 0 ? null : 'empty programs'),
    },
    {
      name: `sources:${id}`,
      route: 'patients/[id]/sources',
      method: 'GET',
      params: { id },
      expectKeys: ['sources'],
      validate: (j) => (j.sources.length > 0 ? null : 'empty sources'),
    },
    {
      name: `consent:${id}`,
      route: 'patients/[id]/consent',
      method: 'GET',
      params: { id },
      expectKeys: [
        'grantedOn',
        'method',
        'identityCredential',
        'ial',
        'aal',
        'accessReadsThisMonth',
        'shareWithCareTeam',
        'adsBlocked',
        'revoked',
      ],
    },
    {
      name: `gamification:${id}`,
      route: 'patients/[id]/gamification',
      method: 'GET',
      params: { id },
      expectKeys: ['points', 'badges', 'challenges'],
    },
    {
      name: `devices:${id}`,
      route: 'patients/[id]/devices',
      method: 'GET',
      params: { id },
      expectKeys: ['connected', 'available'],
    },
    {
      name: `threads:${id}`,
      route: 'patients/[id]/threads',
      method: 'GET',
      params: { id },
      expectKeys: ['threads'],
      validate: (j) => (j.threads.length > 0 ? null : 'no threads'),
    },
    {
      name: `appointments:${id}`,
      route: 'patients/[id]/appointments',
      method: 'GET',
      params: { id },
      expectKeys: ['slots'],
    },
    {
      name: `documents:${id}`,
      route: 'patients/[id]/documents',
      method: 'GET',
      params: { id },
      expectKeys: ['documents'],
      validate: (j) => (j.documents.length > 0 ? null : 'no documents'),
    },
    {
      name: `insights:${id}`,
      route: 'patients/[id]/insights',
      method: 'GET',
      params: { id },
      expectKeys: ['insights'],
      validate: (j) => (j.insights.length > 0 ? null : 'no insights'),
    },
    {
      name: `audit:${id}`,
      route: 'patients/[id]/audit',
      method: 'GET',
      params: { id },
      expectKeys: ['entries'],
      validate: (j) => (j.entries.length > 0 ? null : 'no audit entries'),
    },
    {
      name: `journey:${id}`,
      route: 'patients/[id]/journey',
      method: 'GET',
      params: { id },
      expectKeys: ['steps'],
      validate: (j) =>
        id === 'sarah' ? (j.steps.length === 6 ? null : `sarah steps ${j.steps.length}`) : null,
    },
    {
      name: `share:${id}`,
      route: 'patients/[id]/share',
      method: 'GET',
      params: { id },
      expectKeys: ['shareToken', 'bundle', 'sessions'],
    },
    {
      name: `recipes:${id}`,
      route: 'patients/[id]/recipes',
      method: 'GET',
      params: { id },
      expectKeys: ['recipes', 'activeFilter'],
      validate: (j) => (j.recipes.length > 0 ? null : 'no recipes'),
    },
  ];
}

const STATIC_CHECKS: Check[] = [
  {
    name: 'patients',
    route: 'patients',
    method: 'GET',
    expectKeys: ['patients'],
    validate: (j) => (j.patients.length === 13 ? null : `roster ${j.patients.length}`),
  },
  {
    name: '404',
    route: 'patients/[id]/overview',
    method: 'GET',
    params: { id: 'nobody' },
    expectStatus: 404,
    expectKeys: ['error'],
  },
  {
    name: 'services',
    route: 'services',
    method: 'GET',
    url: 'http://x/api/services',
    expectKeys: ['services'],
    validate: (j) => (j.services.length === 15 ? null : `services ${j.services.length}`),
  },
  {
    name: 'services:filter',
    route: 'services',
    method: 'GET',
    url: 'http://x/api/services?category=pharmacy',
    expectKeys: ['services'],
    validate: (j) =>
      j.services.every((s: any) => s.category === 'pharmacy') ? null : 'bad filter',
  },
  {
    name: 'recipe-detail',
    route: 'recipes/[rid]',
    method: 'GET',
    params: { rid: 'r2' },
    expectKeys: ['id', 'title', 'ingredients', 'steps', 'allergenCallout'],
    validate: (j) =>
      j.ingredients.length > 0 && j.steps.length > 0 ? null : 'empty ingredients/steps',
  },
  {
    name: 'sync',
    route: 'sync',
    method: 'POST',
    body: { patientId: 'robert' },
    expectKeys: ['sources', 'recordLocator'],
    validate: (j) => (j.recordLocator.length > 0 ? null : 'no locator results'),
  },
  {
    name: 'consent-revoke',
    route: 'consent/revoke',
    method: 'POST',
    body: { patientId: 'robert' },
  },
  { name: 'consent-grant', route: 'consent/grant', method: 'POST', body: { patientId: 'robert' } },
  {
    name: 'award',
    route: 'gamification/award',
    method: 'POST',
    body: { patientId: 'miguel' },
    expectKeys: ['badge'],
  },
  {
    name: 'device-connect',
    route: 'devices/connect',
    method: 'POST',
    body: { patientId: 'hector', deviceId: 'omron_evolv' },
  },
  {
    name: 'identity',
    route: 'identity/authenticate',
    method: 'POST',
    body: { patientId: 'sarah', credential: 'passkey' },
    expectKeys: ['session', 'scopes', 'ial', 'aal'],
  },
  {
    name: 'assistant',
    route: 'patients/[id]/assistant',
    method: 'POST',
    params: { id: 'robert' },
    body: { question: 'why did my a1c go up?' },
    expectKeys: ['answer', 'sourceCitation', 'disclaimer', 'suggestedChips'],
  },
  {
    name: 'assistant-fallback',
    route: 'patients/[id]/assistant',
    method: 'POST',
    params: { id: 'maria' },
    body: { question: 'what is the weather' },
    expectKeys: ['answer', 'sourceCitation', 'disclaimer', 'suggestedChips'],
  },
  {
    name: 'provider-questions',
    route: 'patients/[id]/assistant/provider-questions',
    method: 'GET',
    params: { id: 'robert' },
    expectKeys: ['questions'],
    validate: (j) =>
      j.questions.length >= 3 && j.questions.length <= 5 ? null : `q count ${j.questions.length}`,
  },
  {
    name: 'checkin-normal',
    route: 'patients/[id]/checkin',
    method: 'POST',
    params: { id: 'sarah' },
    body: { text: 'slept well, walked 20 minutes' },
    expectKeys: ['logged', 'redFlag', 'response'],
    validate: (j) => (j.redFlag === false ? null : 'false red flag'),
  },
  {
    name: 'checkin-redflag',
    route: 'patients/[id]/checkin',
    method: 'POST',
    params: { id: 'sarah' },
    body: { text: 'severe chest pain this morning' },
    expectKeys: ['logged', 'redFlag', 'response'],
    validate: (j) => (j.redFlag === true ? null : 'missed red flag'),
  },
  {
    name: 'share-checkin',
    route: 'share/checkin',
    method: 'POST',
    body: { patientId: 'sarah', org: 'Lakeside Cardiology' },
    expectKeys: ['shareId', 'sharedWith', 'bundle'],
  },
  { name: 'demo-reset', route: 'demo/reset', method: 'POST', expectKeys: ['ok'] },
];

async function run(): Promise<void> {
  if (!process.env.HTEAP_OUTPUT_DIR) {
    console.error('Set HTEAP_OUTPUT_DIR to an isolated dir (never the shared Output/).');
    process.exit(2);
  }
  const checks: Check[] = [...STATIC_CHECKS];
  for (const p of PERSONAS) checks.push(...patientChecks(p));

  let failed = 0;
  for (const c of checks) {
    try {
      const mod = await import(`../app/api/${c.route}/route`);
      const handler: Handler = mod[c.method];
      if (!handler) throw new Error(`no ${c.method} export`);
      const url =
        c.url ??
        `http://x/api/${c.route.replace('[id]', c.params?.id ?? '').replace('[rid]', c.params?.rid ?? '')}`;
      const req = new Request(url, {
        method: c.method,
        ...(c.body !== undefined
          ? { body: JSON.stringify(c.body), headers: { 'Content-Type': 'application/json' } }
          : {}),
      });
      const res = await handler(req, { params: Promise.resolve(c.params ?? {}) });
      const json = await res.json();
      const wantStatus = c.expectStatus ?? 200;
      if (res.status !== wantStatus)
        throw new Error(
          `status ${res.status} (want ${wantStatus}): ${JSON.stringify(json).slice(0, 120)}`
        );
      for (const k of c.expectKeys ?? []) {
        if (!(k in json))
          throw new Error(`missing key '${k}' in ${JSON.stringify(Object.keys(json))}`);
      }
      const verr = c.validate ? c.validate(json) : null;
      if (verr) throw new Error(verr);
      console.log(`ok   ${c.name}`);
    } catch (err) {
      failed++;
      console.error(`FAIL ${c.name}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`\n${checks.length - failed}/${checks.length} passed`);
  process.exit(failed === 0 ? 0 : 1);
}

run();
