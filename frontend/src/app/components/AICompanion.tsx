import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

const personas = ['strategic', 'analytical', 'motivational', 'technical'];

export default function AICompanion() {
  const [persona, setPersona] = useState<string>('strategic');
  const [greeting, setGreeting] = useState<string>('');
  const [stateLabel, setStateLabel] = useState<string>('neutral');
  const [topRecommendations, setTopRecommendations] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [p, mem, decision] = await Promise.allSettled([
          apiClient.get<any>('/ai/personality').catch(() => null),
          apiClient.get<any>('/ai/memory').catch(() => null),
          apiClient.get<any>('/ai/decision/evaluate').catch(() => null),
        ]);

        const personaType = (p as PromiseFulfilledResult<any>).status === 'fulfilled' && (p as PromiseFulfilledResult<any>).value?.type
          ? (p as PromiseFulfilledResult<any>).value.type
          : 'strategic';

        if (mounted) setPersona(personaType);

        const memVal = (mem as PromiseFulfilledResult<any>).status === 'fulfilled' ? (mem as PromiseFulfilledResult<any>).value : null;
        const name = memVal?.profileName || memVal?.profile?.name || 'Learner';

        // Decision results
        if ((decision as PromiseFulfilledResult<any>).status === 'fulfilled') {
          const val = (decision as PromiseFulfilledResult<any>).value;
          const evaluated = val?.evaluated || [];
          if (mounted && Array.isArray(evaluated)) {
            setTopRecommendations(evaluated.slice(0, 3));
            // compute a simple emotional state
            const avg = (val?.meta?.avgVelocity || 0);
            if (avg > 6) setStateLabel('energized');
            else if (avg > 3) setStateLabel('encouraging');
            else setStateLabel('supportive');
          }
        }

        if (mounted) setGreeting(`Hello ${name}, I'm your ${personaType} companion — currently ${stateLabel}.`);
      } catch (e) {
        if (mounted) setGreeting('Hello — your AI companion is ready.');
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for decision updates from other components (instant re-eval)
  useEffect(() => {
    function onDecisionUpdated(e: any) {
      const val = e?.detail;
      const evaluated = val?.evaluated || [];
      if (Array.isArray(evaluated)) {
        setTopRecommendations(evaluated.slice(0, 3));
        const avg = (val?.meta?.avgVelocity || 0);
        if (avg > 6) setStateLabel('energized');
        else if (avg > 3) setStateLabel('encouraging');
        else setStateLabel('supportive');
        // small visual reaction
        const anim = document.createElement('div');
        anim.className = 'ai-reaction-burst';
        anim.textContent = 'AI adapted recommendations';
        document.body.appendChild(anim);
        setTimeout(() => { anim.classList.add('ai-reaction-hide'); }, 900);
        setTimeout(() => { try { document.body.removeChild(anim); } catch {} }, 1500);
      }
    }

    window.addEventListener('ai:decision:updated', onDecisionUpdated as EventListener);
    return () => window.removeEventListener('ai:decision:updated', onDecisionUpdated as EventListener);
  }, []);

  async function changePersona(p: string) {
    setPersona(p);
    try {
      await apiClient.post('/ai/personality', { type: p }).catch(() => null);
      setGreeting(`Switched to ${p} mentor voice.`);
    } catch {
      // ignore
    }
  }

  return (
    <div className="glass p-4 rounded-xl ai-companion">
      <div className="flex items-start gap-4">
        <div className="hologram-viewport"><div className="hologram-core" /></div>
        <div style={{ flex: 1 }}>
          <div className="text-sm text-muted-foreground">AI Companion</div>
          <div className="font-medium mt-1">{greeting}</div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {personas.map((p) => (
              <button key={p} className={`pill ${p === persona ? '' : 'muted'}`} onClick={() => changePersona(p)}>{p}</button>
            ))}
          </div>

          {topRecommendations && topRecommendations.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold">Adaptive Recommendations</div>
              <div className="mt-2 space-y-2">
                {topRecommendations.map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.career}</div>
                      <div className="text-xs text-muted-foreground">{(r.reasons || []).slice(0,2).join(' • ')}</div>
                    </div>
                    <div className="text-sm font-semibold">{Math.round((r.adaptiveScore || 0))}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
