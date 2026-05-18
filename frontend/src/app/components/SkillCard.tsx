import { motion } from 'motion/react';
import { CheckCircle, Circle, Zap } from 'lucide-react';
import { Card } from './Card';

interface SkillCardProps {
  skill: string;
  status?: 'learned' | 'learning' | 'recommended';
  proficiency?: number;
  index?: number;
}

export function SkillCard({
  skill,
  status = 'recommended',
  proficiency = 0,
  index = 0,
}: SkillCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'learned':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'learning':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'learned':
        return 'bg-green-500/10 border-green-500/30';
      case 'learning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-primary/10 border-primary/30';
    }
  };

  const getProgressColor = () => {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 50) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`p-4 ${getStatusColor()} border transition-all hover:border-primary/60 group cursor-pointer`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {getStatusIcon()}
            <div>
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {skill}
              </h4>
              <p className="text-xs text-muted-foreground">
                {status === 'learned' && 'Mastered'}
                {status === 'learning' && 'In Progress'}
                {status === 'recommended' && 'Recommended'}
              </p>
            </div>
          </div>
        </div>

        {proficiency > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Proficiency</span>
              <span className="text-foreground font-medium">{proficiency}%</span>
            </div>
            <div className="w-full h-1 bg-background rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getProgressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${proficiency}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
