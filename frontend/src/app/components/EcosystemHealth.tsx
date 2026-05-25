import React, { useEffect, useMemo, useState } from 'react';
import { useAdaptiveAI } from '../context/adaptiveAI';
import { apiClient } from '../../services/apiClient';

export default function EcosystemHealth() {
  const { lastUpdated } = useAdaptiveAI();
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Demo snapshots for local/dev when backend is unreachable or auth blocks requests
  const DEMO_SNAPSHOTS = React.useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `demo-${i}`,
      createdAt: new Date(now - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      topItems: ['AI Engineer','Data Scientist','ML Researcher'].slice(0, 3)
    }));
  }, []);

  useEffect(() => {
    let mounted = true;
    apiClient.get<any>('/ai/decision/snapshots?limit=24').then((res) => {
      if (!mounted) return;
      const arr = Array.isArray(res) ? res : (res?.snapshots || []);
      if (arr && arr.length) setSnapshots(arr);
      else setSnapshots(DEMO_SNAPSHOTS);
    }).catch(() => {
      if (mounted) setSnapshots(DEMO_SNAPSHOTS);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [lastUpdated]);

  const metrics = useMemo(() => {
    if (!snapshots.length) return { avgIntervalMs: 0, lastSnapshotAgeMs: null, snapshotCount: 0 };
    const times = snapshots.map((s) => new Date(s.createdAt).getTime()).sort((a, b) => a - b);
    const diffs: number[] = [];
    for (let i = 1; i < times.length; i++) diffs.push(times[i] - times[i - 1]);
    const avg = diffs.length ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
    const lastAge = Date.now() - times[times.length - 1];
    return { avgIntervalMs: Math.round(avg), lastSnapshotAgeMs: Math.round(lastAge), snapshotCount: snapshots.length };
  }, [snapshots]);

  if (loading) return <div className="glass p-3">Calculating ecosystem health…</div>;

  return (
    <div className="glass p-3 rounded-xl ecosystem-health">
      <h4 className="text-lg font-semibold">Ecosystem Health</h4>
      <div className="mt-2 grid grid-cols-1 gap-2">
        <div className="flex justify-between"><div className="text-sm">Snapshots</div><div className="font-medium">{metrics.snapshotCount}</div></div>
        <div className="flex justify-between"><div className="text-sm">Avg snapshot interval</div><div className="font-medium">{metrics.avgIntervalMs ? `${Math.round(metrics.avgIntervalMs/1000)}s` : '—'}</div></div>
        <div className="flex justify-between"><div className="text-sm">Last snapshot age</div><div className="font-medium">{metrics.lastSnapshotAgeMs != null ? `${Math.round(metrics.lastSnapshotAgeMs/1000)}s` : '—'}</div></div>
        <div className="text-xs text-muted-foreground">These metrics help tune snapshot frequency, animation pacing and synchronization.</div>
      </div>
    </div>
  );
}
