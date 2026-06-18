'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PERSONA, isPersonaId, type PersonaId } from './personas';

const STORAGE_KEY = 'hteap.persona';

interface PersonaContextValue {
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
  /** Bumped after any mutation (sync, consent, award, reset…) so every
   *  useApi hook revalidates without a page reload. */
  dataVersion: number;
  refreshData: () => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaIdState] = useState<PersonaId>(DEFAULT_PERSONA);
  const [dataVersion, setDataVersion] = useState(0);

  // Restore persisted selection after mount (avoids hydration mismatch).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isPersonaId(stored)) setPersonaIdState(stored);
  }, []);

  const setPersonaId = useCallback((id: PersonaId) => {
    setPersonaIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const refreshData = useCallback(() => setDataVersion((v) => v + 1), []);

  const value = useMemo(
    () => ({ personaId, setPersonaId, dataVersion, refreshData }),
    [personaId, setPersonaId, dataVersion, refreshData]
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used inside <PersonaProvider>');
  return ctx;
}
