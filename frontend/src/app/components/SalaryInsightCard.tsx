import { motion } from 'motion/react';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { Card } from './Card';

interface SalaryInsightCardProps {
  career: string;
  salaryEstimate?: string;
  minSalary?: number;
  maxSalary?: number;
  marketDemand?: 'high' | 'medium' | 'low';
  growthRate?: number;
  index?: number;
}

export function SalaryInsightCard({
  career,
  salaryEstimate,
  minSalary,
  maxSalary,
  marketDemand = 'high',
  growthRate = 0,
  index = 0,
}: SalaryInsightCardProps) {
  const getDemandColor = () => {
    switch (marketDemand) {
      case 'high':
        return 'text-green-400 bg-green-500/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10';
      default:
        return 'text-red-400 bg-red-500/10';
    }
  };

  const getDemandLabel = () => {
    switch (marketDemand) {
      case 'high':
        return 'High Demand';
      case 'medium':
        return 'Moderate Demand';
      default:
        return 'Low Demand';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold text-foreground">{career}</h3>
              <p className="text-xs text-muted-foreground">Salary Insights</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDemandColor()}`}>
            {getDemandLabel()}
          </div>
        </div>

        <div className="space-y-4">
          {/* Salary range */}
          {salaryEstimate || (minSalary && maxSalary) ? (
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Average Salary</p>
              {salaryEstimate ? (
                <p className="text-2xl font-bold text-primary">{salaryEstimate}</p>
              ) : (
                <div>
                  <p className="text-lg font-bold text-primary">
                    ${minSalary?.toLocaleString()} - ${maxSalary?.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    USD per year
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Growth rate */}
          {growthRate > 0 && (
            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground">5-Year Growth</p>
                <p className="text-lg font-bold text-green-400">+{growthRate}%</p>
              </div>
            </div>
          )}

          {/* Market stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-secondary" />
              <p className="text-muted-foreground">Job Openings</p>
              <p className="font-bold text-foreground">Abundant</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-muted-foreground">Career Growth</p>
              <p className="font-bold text-foreground">Strong</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
