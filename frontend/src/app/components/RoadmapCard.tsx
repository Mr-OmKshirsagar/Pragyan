import { motion } from 'motion/react';
import { BookOpen, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from './Card';

interface RoadmapCardProps {
  roadmap: {
    id: string;
    title: string;
    category: string;
    level: string;
    matchScore?: number;
    reason?: string;
    tags?: string[];
    duration?: string;
  };
  index?: number;
  onClick?: () => void;
}

export function RoadmapCard({ roadmap, index = 0, onClick }: RoadmapCardProps) {
  const getLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner') || lowerLevel === 'junior')
      return 'bg-green-500/20 text-green-300';
    if (lowerLevel.includes('intermediate') || lowerLevel === 'mid')
      return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-red-500/20 text-red-300';
  };

  const getLevelLabel = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner') || lowerLevel === 'junior') return '🌱 Beginner';
    if (lowerLevel.includes('intermediate') || lowerLevel === 'mid') return '📈 Intermediate';
    return '🚀 Advanced';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="p-6 hover:border-primary/50 transition-all overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {roadmap.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getLevelColor(roadmap.level)}`}>
                {getLevelLabel(roadmap.level)}
              </span>
            </div>

            {roadmap.reason && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {roadmap.reason}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs">
                {roadmap.category}
              </span>
              {roadmap.tags?.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm">
              {roadmap.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{roadmap.duration}</span>
                </div>
              )}
              {roadmap.matchScore && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>{Math.round(roadmap.matchScore)}% relevant</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Action icon */}
          <motion.div
            className="flex-shrink-0 pt-1"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.div>
        </div>

        {/* Progress bar */}
        {roadmap.matchScore && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-muted-foreground">Match Score</span>
              <span className="font-semibold text-primary">{Math.round(roadmap.matchScore)}%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${roadmap.matchScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
