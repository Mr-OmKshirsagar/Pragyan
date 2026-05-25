import React, { useEffect, useRef, useState } from 'react';

type Props = { value: number; duration?: number; className?: string };

export const AnimatedCounter: React.FC<Props> = ({ value, duration = 1000, className }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = Math.max(0, Math.min(100, Math.round(value)));

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = start;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{display}%</span>;
};

export default AnimatedCounter;
