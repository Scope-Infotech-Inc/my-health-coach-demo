import { readAppMetaJson } from '@/lib/api-helpers';
import { AuditLog } from './audit';

/**
 * SEAM — IdentityProvider (PRD §9, FR-14). Demo: scripted IAL2/AAL2
 * verification, no real IdP, nothing leaves the app. Production swap:
 * CMS digital identity (passkey/mDL) + OAuth 2.0 scopes behind this
 * same contract.
 */
export type Credential = 'passkey' | 'mdl';

export interface IdentitySession {
  session: string;
  scopes: string[];
  ial: string;
  aal: string;
}

interface IdentityDefaults {
  ial: string;
  aal: string;
  credentialOptions: string[];
  method: string;
  note?: string;
}

const DEFAULT_SCOPES = [
  'patient/Condition.read',
  'patient/MedicationRequest.read',
  'patient/Observation.read',
  'patient/AllergyIntolerance.read',
  'patient/DocumentReference.read',
  'patient/Immunization.read',
];

export const IdentityProvider = {
  defaults(): IdentityDefaults {
    return (
      readAppMetaJson<IdentityDefaults>('identity_defaults') ?? {
        ial: 'IAL2',
        aal: 'AAL2',
        credentialOptions: ['passkey', 'mdl'],
        method: 'SMART on FHIR / OAuth 2.0',
      }
    );
  },

  /** Scripted verification. Deterministic session token (no randomness). */
  authenticate(patientId: string, credential: Credential): IdentitySession {
    const d = IdentityProvider.defaults();
    AuditLog.record({
      patientId,
      actor: 'You (this app)',
      actorRole: 'patient',
      scope: 'identity_verification',
      purposeOfUse: 'individual_access',
    });
    return {
      session: `demo-session-${patientId}-${credential}`,
      scopes: DEFAULT_SCOPES,
      ial: d.ial,
      aal: d.aal,
    };
  },
};
