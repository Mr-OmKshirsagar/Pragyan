import React from 'react';
import { motion } from 'motion/react';

export default function DriftVisualization() {
  return (
    <div className="glass p-4 rounded-xl">
      <h4 className="text-lg font-semibold">Recommendation Drift</h4>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="col-span-2 p-3 rounded-lg bg-gradient-to-br from-primary/6 to-transparent border border-primary/10">
          <div className="text-sm text-muted-foreground">Ranking evolution (preview)</div>
          <div className="mt-2">
            <svg width="100%" height="64" viewBox="0 0 400 64"><path d="M0 40 L80 28 L160 32 L240 20 L320 28 L400 16" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-accent/6 to-transparent border border-accent/10">
          <div className="text-sm text-muted-foreground">Confidence</div>
          <div className="mt-2 text-2xl font-semibold">78%</div>
        </div>
      </div>
    </div>
  );
}
