import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Lock, CheckCircle2, Clock, Zap } from 'lucide-react';
import { SkillRoadmap, SkillProgress } from '../types/roadmap';
import { getAllRoadmaps, getRoadmapById } from '../data/roadmaps';
import { GlassCard } from '../components/GlassCard';
import { getSkillProgress } from '../utils/roadmapUtils';
import { fetchRoadmapProgress } from '../../services/roadmapProgress';

interface SkillsRoadmapPageProps {
  onSkillSelect: (skill: SkillRoadmap) => void;
  selectedView: 'list' | 'detail' | 'learning';
}

export function SkillsRoadmapPage({ onSkillSelect }: SkillsRoadmapPageProps) {
  const [skills, setSkills] = useState<SkillRoadmap[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, SkillProgress | null>>({});
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      const allSkills = getAllRoadmaps();
      setSkills(allSkills);

      const progMap: Record<string, SkillProgress | null> = {};
      allSkills.forEach((skill) => {
        progMap[skill.id] = getSkillProgress(skill.id);
      });

      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const serverProgress = await fetchRoadmapProgress();
          if (Array.isArray(serverProgress)) {
            serverProgress.forEach((entry) => {
              progMap[entry.roadmapId] = {
                skillId: entry.roadmapId,
                progress: entry.progressPercentage,
                currentDay: entry.currentDay,
                xp: entry.xp,
                streak: {
                  currentStreak: entry.streak,
                  longestStreak: entry.streak,
                  totalDaysCompleted: entry.completedDays.length,
                },
                completedTasks: entry.completedTasks,
                completedDays: entry.completedDays,
                startedAt: entry.lastActiveDate || new Date().toISOString(),
              };
            });
          }
        } catch {
          // keep local fallback when sync fails
        }
      }

      setProgressMap(progMap);
    };

    void loadProgress();
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.skillCategory)));
  const filteredSkills = filterCategory
    ? skills.filter((s) => s.skillCategory === filterCategory)
    : skills;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-500 to-emerald-500';
      case 'intermediate':
        return 'from-blue-500 to-cyan-500';
      case 'advanced':
        return 'from-purple-500 to-pink-500';
      case 'expert':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Learning Roadmaps</h1>
          <p className="text-slate-400">
            Master new skills with our structured daily learning paths
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-2 flex-wrap"
        >
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              filterCategory === null
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Skills
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                filterCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => {
            const progress = progressMap[skill.id];
            const isCompleted = progress?.progress === 100;
            const isStarted = progress && progress.completedTasks.length > 0;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSkillSelect(skill)}
                className="cursor-pointer group"
              >
                <GlassCard className="p-6 h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{skill.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {skill.skillName}
                        </h3>
                        <p className="text-xs text-slate-400 capitalize">
                          {skill.skillCategory}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {isCompleted ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        <span className="text-xs font-semibold text-green-300">Completed</span>
                      </div>
                    ) : isStarted ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-300">In Progress</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/50">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-300">Not Started</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Progress Bar */}
                  {progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs font-semibold text-white">
                          {Math.round(progress.progress)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-slate-600/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Duration</div>
                      <div className="text-sm font-semibold text-white">
                        {skill.totalDuration}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Tasks</div>
                      <div className="text-sm font-semibold text-white">
                        {skill.totalDays}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Level</div>
                      <div className="text-sm font-semibold text-white">
                        {getDifficultyLabel(skill.difficulty)}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 h-1 rounded-full bg-gradient-to-r ${getDifficultyColor(
                        skill.difficulty
                      )}`}
                    />
                  </div>

                  {/* Stats if started */}
                  {progress && progress.completedTasks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-slate-300">
                            {progress.streak.currentStreak} day streak
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-300">
                            {progress.completedTasks.length}/{skill.totalDays}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 text-lg">No skills found in this category</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
