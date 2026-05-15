import React, { useState, useEffect } from 'react';
import { careerService, CareerMatch } from '@/services/careerMatching';
import { GlassCard } from '@/app/components/GlassCard';
import { GlassButton } from '@/app/components/GlassButton';
import { AnimatedProgress } from '@/app/components/AnimatedProgress';
import { SkillTag } from '@/app/components/SkillTag';
import { toast } from 'sonner';

interface CareerMatchesProps {
  onCareerSelect?: (career: CareerMatch) => void;
}

export function CareerMatches({ onCareerSelect }: CareerMatchesProps) {
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadCareerMatches();
  }, []);

  const loadCareerMatches = async () => {
    try {
      setLoading(true);
      const data = await careerService.getCareerMatches();
      setMatches(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load career matches';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (level: string) => {
    const colors = {
      high: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-orange-500/20 text-orange-400',
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6 border-red-500/30">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <GlassButton onClick={loadCareerMatches} className="bg-purple-600 hover:bg-purple-700">
            Retry
          </GlassButton>
        </div>
      </GlassCard>
    );
  }

  if (matches.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-gray-400 mb-4">
          No career matches found. Complete an assessment to get recommendations.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <GlassCard
          key={match.careerId}
          className="p-6 hover:border-purple-500/50 transition-all cursor-pointer"
          onClick={() => setExpandedId(expandedId === match.careerId ? null : match.careerId)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  #{index + 1} {match.careerTitle}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(match.confidenceLevel)}`}>
                  {match.confidenceLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Match Score</span>
                    <span className="text-sm font-semibold text-purple-400">{Math.round(match.matchScore * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${match.matchScore * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {onCareerSelect && (
              <GlassButton
                onClick={(e) => {
                  e.stopPropagation();
                  onCareerSelect(match);
                }}
                className="bg-purple-600 hover:bg-purple-700 ml-4"
              >
                Select
              </GlassButton>
            )}
          </div>

          {expandedId === match.careerId && (
            <div className="mt-6 pt-6 border-t border-gray-600/30 space-y-4">
              {/* Match Reasons */}
              {match.reasons && match.reasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Why This Career?</h4>
                  <ul className="space-y-1">
                    {match.reasons.map((reason, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              {match.requiredSkills && match.requiredSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.requiredSkills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              {match.skillGaps && match.skillGaps.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">Skills to Develop</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.skillGaps.map((skill) => (
                      <SkillTag key={skill} skill={skill} className="bg-yellow-500/20 text-yellow-400" />
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Personality Match */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Education Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${match.educationMatch * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-blue-400">{Math.round(match.educationMatch * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Personality Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${(match.personalityMatch ?? match.experienceMatch) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-green-400">{Math.round((match.personalityMatch ?? match.experienceMatch) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
