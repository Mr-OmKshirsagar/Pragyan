import React from 'react';
import { motion } from 'motion/react';

type Props = { confidence: number };

export const ConfidenceBar: React.FC<Props> = ({ confidence = 0 }) => {
  const pct = Math.max(0, Math.min(100, confidence));
  return (
    <div className="confidence-wrapper" style={{ width: '100%' }}>
      <div className="confidence-label">AI Confidence</div>
      <div className="confidence-track" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 14 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg,#06b6d4,#7c3aed)' }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
