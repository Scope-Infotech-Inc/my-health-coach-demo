import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, readPersonaRaw, unknownPatient } from '@/lib/api-helpers';
import { DEMO_TODAY } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/overview — app-home aggregation per #spec-api:
 * patient, demoToday, banner{severity,title,body,ctaLabel,careTeamNotified},
 * tiles[5]{label,value,delta?{text,tone},detail}.
 */

interface AlertRow {
  severity: string;
  title: string;
  body: string;
  cta_label: string | null;
  care_team_notified: number;
}

interface RawTile {
  label: string;
  value: string;
  deltaText?: string;
  deltaTone?: string;
  detail: string;
}

interface PersonaRawOverview {
  headerRole?: string;
  secondaryLanguage?: string;
  tiles?: RawTile[];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();
  const raw = readPersonaRaw<PersonaRawOverview>(id);

  const alert = db
    .prepare(
      `SELECT severity, title, body, cta_label, care_team_notified
       FROM alerts WHERE patient_id = ? ORDER BY id LIMIT 1`
    )
    .get(id) as AlertRow | undefined;

  const tiles = (raw?.tiles ?? []).map((t) => ({
    label: t.label,
    value: t.value,
    ...(t.deltaText != null ? { delta: { text: t.deltaText, tone: t.deltaTone ?? '' } } : {}),
    detail: t.detail,
  }));

  return NextResponse.json({
    patient: {
      id: patient.id,
      firstName: patient.first_name,
      lastNameInitial: patient.last_name_initial,
      age: patient.age,
      category: patient.category,
      planType: patient.plan_type,
      ...(patient.condition_detail != null ? { conditionDetail: patient.condition_detail } : {}),
      providerOrg: patient.provider_org,
      avatarInitials: patient.avatar_initials,
      preferredLanguage: patient.preferred_language,
      ...(raw?.secondaryLanguage != null ? { secondaryLanguage: raw.secondaryLanguage } : {}),
      ...(raw?.headerRole != null ? { headerRole: raw.headerRole } : {}),
      medicareContext: patient.medicare_context,
      dualEligible: patient.dual_eligible === 1,
    },
    demoToday: DEMO_TODAY,
    ...(alert
      ? {
          banner: {
            severity: alert.severity,
            title: alert.title,
            body: alert.body,
            ...(alert.cta_label != null ? { ctaLabel: alert.cta_label } : {}),
            careTeamNotified: alert.care_team_notified === 1,
          },
        }
      : {}),
    tiles,
  });
}
