import React from 'react';
import '../../styles/results-premium.css';

export const AmbientBackground: React.FC<{ variant?: string }> = ({ variant = 'default' }) => {
  const className = `ambient-bg ambient-${variant}`;
  return (
    <div className={className} aria-hidden>
      <svg className="ambient-lines" viewBox="0 0 800 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <g stroke="url(#g1)" strokeWidth="1" strokeOpacity="0.7">
          <path d="M0 200 C200 100 400 300 800 200" className="ambient-path" />
          <path d="M0 260 C250 180 450 340 800 240" className="ambient-path delay" />
        </g>
      </svg>
      <div className="ambient-particles" />
    </div>
  );
};

export default AmbientBackground;
