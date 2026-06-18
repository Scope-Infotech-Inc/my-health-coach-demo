'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePersona } from './persona-context';

interface ApiState<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
}

/**
 * Minimal SWR-style hook for the internal /api/*. Refetches when the path,
 * the active persona, or the global dataVersion changes (persona toggle and
 * mutations swap all data via client refetch — no reload). Keeps the last
 * data visible while revalidating so persona swaps don't flash empty.
 * Pass null to skip fetching.
 */
export function useApi<T>(path: string | null): ApiState<T> & { refetch: () => void } {
  const { dataVersion } = usePersona();
  const [state, setState] = useState<ApiState<T>>({
    data: undefined,
    error: undefined,
    loading: path !== null,
  });
  const generation = useRef(0);

  const load = useCallback(() => {
    if (path === null) return;
    const gen = ++generation.current;
    setState((s) => ({ ...s, loading: true }));
    fetch(path)
      .then(async (res) => {
        const body = await res.json();
        if (gen !== generation.current) return;
        if (!res.ok) {
          setState({
            data: undefined,
            error: body?.error ?? `Request failed (${res.status})`,
            loading: false,
          });
        } else {
          setState({ data: body as T, error: undefined, loading: false });
        }
      })
      .catch((err: unknown) => {
        if (gen !== generation.current) return;
        setState({
          data: undefined,
          error: err instanceof Error ? err.message : 'Request failed',
          loading: false,
        });
      });
  }, [path]);

  useEffect(() => {
    if (path === null) {
      setState({ data: undefined, error: undefined, loading: false });
      return;
    }
    load();
    // dataVersion is an intentional extra trigger: bump → revalidate.
  }, [path, load, dataVersion]);

  return { ...state, refetch: load };
}

/** POST helper for the demo's mutation endpoints; bump dataVersion after. */
export async function postApi<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? `Request failed (${res.status})`);
  return json as T;
}
