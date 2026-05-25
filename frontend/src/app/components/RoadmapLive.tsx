import React, { useEffect, useState } from 'react';
import '../../styles/results-premium.css';
import { useAdaptiveAI } from '../context/adaptiveAI';

type Node = { id: string; title: string; completed?: boolean };

export const RoadmapLive: React.FC<{ nodes?: Node[] }> = ({ nodes }) => {
  const { decision } = useAdaptiveAI();
  const [pulse, setPulse] = useState(false);

  const sample: Node[] = nodes || [
    { id: 'n1', title: 'Fundamentals', completed: true },
    { id: 'n2', title: 'Applied Projects', completed: false },
    { id: 'n3', title: 'Portfolio & Network', completed: false },
  ];

  useEffect(() => {
    if (decision) {
      // briefly pulse roadmap nodes to indicate mutation
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 900);
      return () => clearTimeout(t);
    }
    return;
  }, [decision]);

  return (
    <div className={`roadmap-live p-3 rounded-md glass mt-4 ${pulse ? 'pulse' : ''}`}>
      <div className="text-sm font-medium">Living Roadmap</div>
      <div className="mt-3 flex items-center gap-4">
        {sample.map((n, i) => (
          <div key={n.id} className={`roadmap-node ${n.completed ? 'completed' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
            <div className="node-dot" />
            <div className="text-xs mt-2">{n.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapLive;
