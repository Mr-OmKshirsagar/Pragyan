import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../../services/apiClient';

type AdaptiveState = {
  decision?: any;
  lastUpdated?: string;
  refresh: () => Promise<void>;
};

const AdaptiveAIContext = createContext<AdaptiveState | undefined>(undefined);

export const AdaptiveAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decision, setDecision] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);

  async function refresh() {
    try {
      const res = await apiClient.get<any>('/ai/decision/evaluate').catch(() => null);
      if (res) {
        setDecision(res);
        setLastUpdated(new Date().toISOString());
        // emit global event for legacy listeners
        try { window.dispatchEvent(new CustomEvent('ai:decision:updated', { detail: res })); } catch {}
      }
    } catch (e) {
      // ignore
    }
  }

  // initial load
  useEffect(() => { void refresh(); }, []);

  const value = useMemo(() => ({ decision, lastUpdated, refresh }), [decision, lastUpdated]);
  return <AdaptiveAIContext.Provider value={value}>{children}</AdaptiveAIContext.Provider>;
};

export function useAdaptiveAI() {
  const ctx = useContext(AdaptiveAIContext);
  if (!ctx) throw new Error('useAdaptiveAI must be used within AdaptiveAIProvider');
  return ctx;
}
