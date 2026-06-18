'use client';

import { useApi } from '@/lib/use-api';
import { DEMO_TODAY, demoGreetingWord, formatFullDate, syncRelativeLabel } from '@/lib/demo-clock';

interface OverviewLite {
  patient: {
    firstName: string;
    lastNameInitial: string;
    secondaryLanguage?: string;
    headerRole?: string;
  };
}
interface SourceLite {
  lastSyncAt?: string;
  continuous: boolean;
}
interface ConsentLite {
  ial: string;
  aal: string;
  revoked: boolean;
}

export interface HeaderData {
  firstName: string;
  fullName: string;
  greeting: string;
  dateLabel: string;
  syncLabel: string;
  hasSources: boolean;
  ial?: string;
  aal?: string;
  revoked: boolean;
  secondaryLanguage?: string;
}

/** Shared persona chrome for the desktop header and mobile app bar. */
export function useHeaderData(patientId: string): HeaderData {
  const { data: ov } = useApi<OverviewLite>(`/api/patients/${patientId}/overview`);
  const { data: src } = useApi<{ sources: SourceLite[] }>(`/api/patients/${patientId}/sources`);
  const { data: consent } = useApi<ConsentLite>(`/api/patients/${patientId}/consent`);

  const firstName = ov?.patient.firstName ?? '';
  const fullName = ov ? `${ov.patient.firstName} ${ov.patient.lastNameInitial}.` : '';

  const sources = src?.sources ?? [];
  const synced = sources
    .map((s) => s.lastSyncAt)
    .filter((t): t is string => Boolean(t))
    .sort()
    .at(-1);
  const syncLabel =
    sources.length === 0 ? 'No sources' : synced ? `Synced ${syncRelativeLabel(synced)}` : 'Live';

  return {
    firstName,
    fullName,
    greeting: demoGreetingWord(),
    dateLabel: formatFullDate(DEMO_TODAY),
    syncLabel,
    hasSources: sources.length > 0,
    ial: consent?.ial,
    aal: consent?.aal,
    revoked: consent?.revoked ?? false,
    secondaryLanguage: ov?.patient.secondaryLanguage,
  };
}
