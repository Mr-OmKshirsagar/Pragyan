import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface MatchScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function MatchScoreCircle({ score, size = 'md', animated = true }: MatchScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    let timer: NodeJS.Timeout;
    let currentScore = 0;
    const increment = score / 50;

    const interval = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        currentScore = score;
        clearInterval(interval);
      }
      setDisplayScore(Math.round(currentScore));
    }, 20);

    return () => clearInterval(interval);
  }, [score, animated]);

  const getColorClass = () => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getStrokeColor = () => {
    if (score >= 85) return '#4ade80';
    if (score >= 70) return '#60a5fa';
    if (score >= 50) return '#facc15';
    return '#fb923c';
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`relative ${sizeClasses[size]}`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-xl animate-pulse-glow`} />

      {/* SVG Circle */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 120 120"
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? strokeDashoffset : 0}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className={`${textSizes[size]} font-bold ${getColorClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {displayScore}%
        </motion.div>
        <div className="text-xs text-muted-foreground font-medium">Match</div>
      </div>
    </motion.div>
  );
}
