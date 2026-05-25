import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

type BranchNode = { id: string; title: string; unlocked?: boolean; children?: BranchNode[] };

export default function RoadmapBranching() {
  const [branches, setBranches] = useState<BranchNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // try to fetch roadmap mutations; fallback to sample
        const resp = await apiClient.get<any>('/ai/roadmap') .catch(() => null);
        if (resp && resp.mutations) {
          setBranches(resp.mutations as BranchNode[]);
        } else {
          setBranches([
            { id: 'b1', title: 'Foundations', unlocked: true, children: [{ id: 'b1-1', title: 'Core Syntax', unlocked: true }, { id: 'b1-2', title: 'Data Structures', unlocked: false }] },
            { id: 'b2', title: 'Applied AI', unlocked: false, children: [{ id: 'b2-1', title: 'ML Basics', unlocked: false }, { id: 'b2-2', title: 'Model Deployment', unlocked: false }] },
          ]);
        }
      } catch (e) {
        setBranches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="glass p-4">Loading roadmap...</div>;

  return (
    <div className="glass p-4 rounded-xl roadmap-branching">
      <h4 className="text-lg font-semibold">Adaptive Roadmap</h4>
      <div className="mt-4">
        {branches.map((b) => (
          <div key={b.id} className={`branch-group ${b.unlocked ? 'unlocked' : ''}`}>
            <div className="branch-title">{b.title}</div>
            <div className="branch-children mt-2 grid grid-cols-2 gap-3">
              {(b.children || []).map((c) => (
                <div key={c.id} className={`branch-node p-3 rounded-md ${c.unlocked ? 'unlocked' : ''}`}>
                  <div className="node-dot" />
                  <div className="node-title">{c.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
