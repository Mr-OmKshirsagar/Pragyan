interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-white/10 animate-pulse"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse ${className}`}>
      <div className="h-3 w-24 rounded bg-white/10 mb-4" />
      <div className="h-8 w-16 rounded bg-white/10" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-white/10 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}
