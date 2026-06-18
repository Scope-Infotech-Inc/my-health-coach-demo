import { readAppMetaJson } from '@/lib/api-helpers';

/**
 * SEAM — TerminologyService (PRD §9, FR-33). Demo: seeded code↔display
 * map (illustrative codes — validate against current LOINC / RxNorm /
 * SNOMED CT US Edition releases before any real use, per PRD §11.1).
 * Production swap: real value-set service behind this contract.
 */
export type CodeSystem = 'loinc' | 'rxnorm' | 'snomed';

interface TerminologyExamples {
  disclaimer: string;
  loinc: Record<string, string>;
  rxnorm: Record<string, string>;
  snomed: Record<string, string>;
}

export const TerminologyService = {
  examples(): TerminologyExamples | null {
    return readAppMetaJson<TerminologyExamples>('terminology_examples');
  },

  display(system: CodeSystem, code: string): string | null {
    const ex = TerminologyService.examples();
    return ex?.[system]?.[code] ?? null;
  },

  disclaimer(): string {
    return (
      TerminologyService.examples()?.disclaimer ??
      'Codes are illustrative — validate against current official value sets before any real use.'
    );
  },
};
