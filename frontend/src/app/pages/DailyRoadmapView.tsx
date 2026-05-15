import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { SkillRoadmap, DailyTask, SkillProgress } from '../types/roadmap';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import {
  getSkillProgress,
  completeTask,
  uncompleteTask,
  createNewProgress,
  calculateRemainingTime,
  checkAchievements,
  achievementMetadata,
} from '../utils/roadmapUtils';
import { fetchRoadmapProgress, updateRoadmapTask } from '../../services/roadmapProgress';

interface DailyRoadmapViewProps {
  skill: SkillRoadmap;
  onBack: () => void;
  onComplete: (skill: SkillRoadmap) => void;
}

export function DailyRoadmapView({ skill, onBack, onComplete }: DailyRoadmapViewProps) {
  const [progress, setProgress] = useState<SkillProgress | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    const loadProgress = async () => {
      const savedProgress = getSkillProgress(skill.id);
      const fallback = savedProgress || createNewProgress(skill.id);
      setProgress(fallback);
      setCurrentDay(fallback.currentDay);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }

      try {
        const serverProgress = await fetchRoadmapProgress(skill.id);
        if (serverProgress && !Array.isArray(serverProgress)) {
          const mapped: SkillProgress = {
            skillId: skill.id,
            progress: serverProgress.progressPercentage,
            currentDay: serverProgress.currentDay,
            xp: serverProgress.xp,
            streak: {
              currentStreak: serverProgress.streak,
              longestStreak: serverProgress.streak,
              totalDaysCompleted: serverProgress.completedDays.length,
            },
            completedTasks: serverProgress.completedTasks,
            completedDays: serverProgress.completedDays,
            startedAt: serverProgress.lastActiveDate || new Date().toISOString(),
          };

          setProgress(mapped);
          setCurrentDay(mapped.currentDay);
        }
      } catch {
        setSyncError('Using local progress. Cloud sync is temporarily unavailable.');
      }
    };

    void loadProgress();
  }, [skill.id]);

  const handleTaskToggle = (taskId: string) => {
    if (!progress) return;

    const isCompleted = progress.completedTasks.includes(taskId);
    let newProgress;

    if (isCompleted) {
      newProgress = uncompleteTask(skill.id, taskId);
    } else {
      newProgress = completeTask(skill.id, taskId);
    }

    const currentAchievements = checkAchievements(newProgress);
    const previousAchievements = checkAchievements(progress);
    const newlyUnlocked = currentAchievements.filter(
      (a) => !previousAchievements.includes(a)
    );

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }

    setProgress(newProgress);

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      void updateRoadmapTask(taskId, {
        roadmapId: skill.id,
        totalTasks: skill.totalDays,
        dayId: `day-${currentDay}`,
        completed: !isCompleted,
        xpReward: 10,
      })
        .then((response) => {
          const server = response.progress;
          setProgress((prev) => {
            if (!prev) {
              return prev;
            }

            return {
              ...prev,
              progress: server.progressPercentage,
              currentDay: server.currentDay,
              xp: server.xp,
              completedTasks: server.completedTasks,
              completedDays: server.completedDays,
              streak: {
                ...prev.streak,
                currentStreak: response.user?.streak ?? prev.streak.currentStreak,
                longestStreak: Math.max(prev.streak.longestStreak, response.user?.streak ?? 0),
                totalDaysCompleted: server.completedDays.length,
              },
            };
          });
          setSyncError('');
        })
        .catch(() => {
          setSyncError('Progress saved locally. Server sync failed this time.');
        });
    }

    if (newProgress.progress === 100) {
      setTimeout(() => onComplete(skill), 500);
    }
  };

  const goToNextDay = () => {
    if (currentDay < skill.totalDays) {
      setCurrentDay(currentDay + 1);
    }
  };

  const goToPreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  if (!progress) return null;

  const currentTaskIndex = currentDay - 1;
  const currentTask = skill.dailyTasks[currentTaskIndex];
  const isTaskCompleted = progress.completedTasks.includes(currentTask.id);
  const remainingTime = calculateRemainingTime(
    progress.completedTasks.length,
    skill.totalDays,
    skill.estimatedHours
  );

  // Get week info
  const currentWeek = Math.ceil(currentDay / 7);
  const weekModule = skill.weeklyModules[currentWeek - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <GlassCard className="p-6 w-80">
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {achievementMetadata[newAchievements[0]]?.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {achievementMetadata[newAchievements[0]]?.title}
                </h3>
                <p className="text-slate-300 text-sm">
                  {achievementMetadata[newAchievements[0]]?.description}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-1">{skill.skillName}</h1>
            <p className="text-slate-400">Day {currentDay} of {skill.totalDays}</p>
          </div>
          <div className="w-10" />
        </motion.div>

        {/* Progress Overview */}
        {syncError && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
            {syncError}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Progress</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">{Math.round(progress.progress)}%</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <motion.div
                animate={{ width: `${progress.progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Streak</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-white">{progress.streak.currentStreak}</div>
            <div className="text-xs text-slate-400 mt-1">days</div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Time Left</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold text-white">{remainingTime}</div>
            <div className="text-xs text-slate-400 mt-1">remaining</div>
          </GlassCard>
        </motion.div>

        {/* Week Info */}
        {weekModule && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <h3 className="font-semibold text-white">{weekModule.title}</h3>
                <p className="text-sm text-slate-300 mt-1">
                  {weekModule.topics.join(' • ')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Today's Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4">Today's Goal</h2>
          <GlassCard className="p-8 border-2 border-blue-500/30">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{currentTask.title}</h3>
              <p className="text-slate-300">{currentTask.description}</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{currentTask.estimatedTime}</span>
              </div>
            </div>

            {currentTask.subtasks && currentTask.subtasks.length > 0 && (
              <div className="mb-8 p-6 bg-slate-700/20 rounded-lg">
                <h4 className="font-semibold text-white mb-4">Learning Points:</h4>
                <ul className="space-y-3">
                  {currentTask.subtasks.map((subtask, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <span className="text-slate-200">{subtask}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {currentTask.resources && currentTask.resources.length > 0 && (
              <div className="mb-8 p-6 bg-slate-700/20 rounded-lg">
                <h4 className="font-semibold text-white mb-4">Resources:</h4>
                <ul className="space-y-2">
                  {currentTask.resources.map((resource, idx) => (
                    <li key={idx}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Resource {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Complete Button */}
            <button
              onClick={() => handleTaskToggle(currentTask.id)}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isTaskCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
              }`}
            >
              {isTaskCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Task Complete! 🎉
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Task Complete
                </>
              )}
            </button>
          </GlassCard>
        </motion.div>

        {/* Day Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Day Timeline</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: Math.min(skill.totalDays, 28) }).map((_, idx) => {
              const day = idx + 1;
              const isCurrentDay = day === currentDay;
              const isCompleted = skill.dailyTasks
                .slice(0, day)
                .every((task) => progress.completedTasks.includes(task.id));

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDay(day)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all duration-300 ${
                    isCurrentDay
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white ring-2 ring-white/50'
                      : isCompleted
                      ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : day}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <GlassButton
            onClick={goToPreviousDay}
            disabled={currentDay === 1}
            variant="secondary"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Day
          </GlassButton>

          {currentDay < skill.totalDays && (
            <GlassButton
              onClick={goToNextDay}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Next Day
              <ChevronRight className="w-4 h-4" />
            </GlassButton>
          )}

          {currentDay === skill.totalDays && progress.progress === 100 && (
            <GlassButton
              disabled
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Skill Mastered!
            </GlassButton>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
