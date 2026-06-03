import React from 'react';
import type { XpProgression } from '@/types/api';

export default function LevelBoard({ progression, level, xp, percent, xpToNext }: { progression?: XpProgression | null; level: number; xp: number; percent: number; xpToNext: number }) {
  const title = progression?.title || progression?.storedTitle || 'Explorer';
  const displayXp = xp ?? 0;
  const pct = Math.max(0, Math.min(100, percent || 0));

  return (
    <div className="w-full rounded-3xl border border-[rgba(139,92,246,0.25)] bg-[rgba(15,23,42,0.65)] p-4 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Level</p>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">{level}</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{displayXp} XP · {pct}%</p>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/5">
            <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{xpToNext > 0 ? `${xpToNext} XP to reach next level` : 'Ready to level up!'}</p>
    </div>
  );
}
