import React from 'react';
import { motion } from 'motion/react';
import AnimatedCounter from './AnimatedCounter';

type Props = {
  title: string;
  confidence?: number;
  summary?: string;
};

export const CareerCard: React.FC<Props> = ({ title, confidence = 0, summary }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="career-card glass"
      style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{summary}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#7c3aed' }}>
            <AnimatedCounter value={confidence} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Match</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerCard;
