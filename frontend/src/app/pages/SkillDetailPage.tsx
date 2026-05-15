import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, Clock, Target, Zap, ExternalLink, BookOpen, Video, FileText, Lightbulb, Rocket } from 'lucide-react';
import { SkillRoadmap, DailyTask, SkillProgress, Resource } from '../types/roadmap';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import {
  getSkillProgress,
  completeTask,
  uncompleteTask,
  createNewProgress,
  calculateRemainingTime,
  getStreakMessage,
  checkAchievements,
} from '../utils/roadmapUtils';

interface SkillDetailPageProps {
  skill: SkillRoadmap;
  onBack: () => void;
  onStartLearning: (skill: SkillRoadmap) => void;
  onSelectResource?: (resource: Resource, taskTitle: string) => void;
}

export function SkillDetailPage({ skill, onBack, onStartLearning, onSelectResource }: SkillDetailPageProps) {
  const [progress, setProgress] = useState<SkillProgress | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    const savedProgress = getSkillProgress(skill.id);
    setProgress(savedProgress || createNewProgress(skill.id));
  }, [skill.id]);

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    if (completed) {
      setProgress(uncompleteTask(skill.id, taskId));
    } else {
      setProgress(completeTask(skill.id, taskId));
    }
  };

  if (!progress) return null;

  const achievements = checkAchievements(progress);
  const tasksForSelectedDay = skill.dailyTasks.slice((selectedDay - 1) * 1, selectedDay);
  const currentTask = tasksForSelectedDay[0];
  const remainingTime = calculateRemainingTime(
    progress.completedTasks.length,
    skill.totalDays,
    skill.estimatedHours
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white rotate-180" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{skill.icon}</span>
              <h1 className="text-3xl font-bold text-white">{skill.skillName}</h1>
            </div>
            <p className="text-slate-400">{skill.description}</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Progress */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Progress</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(progress.progress)}%</div>
            <div className="h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </GlassCard>

          {/* Streak */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Streak</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{progress.streak.currentStreak}</div>
            <div className="text-xs text-slate-400 mt-1">days</div>
          </GlassCard>

          {/* Tasks Completed */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Tasks Done</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{progress.completedTasks.length}</div>
            <div className="text-xs text-slate-400 mt-1">
              of {skill.totalDays}
            </div>
          </GlassCard>

          {/* Time Left */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Est. Time</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold text-white">{remainingTime}</div>
            <div className="text-xs text-slate-400 mt-1">remaining</div>
          </GlassCard>
        </motion.div>

        {/* Streak Message */}
        {progress.streak.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg"
          >
            <p className="text-center text-yellow-300 font-medium">
              {getStreakMessage(progress.streak.currentStreak)}
            </p>
          </motion.div>
        )}

        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Daily Tasks</h2>
          <GlassCard className="p-6 overflow-visible">
            <div className="space-y-3 overflow-visible">
              <AnimatePresence>
                {skill.dailyTasks.map((task, idx) => {
                  const isCompleted = progress.completedTasks.includes(task.id);
                  const isExpanded = expandedTasks.has(task.id);

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => toggleTaskExpansion(task.id)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 overflow-visible ${
                          isCompleted
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggleTask(task.id, isCompleted);
                              }}
                              className="w-5 h-5 rounded border-slate-500 text-green-500 focus:ring-2 focus:ring-green-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3
                                className={`font-semibold transition-colors ${
                                  isCompleted
                                    ? 'text-green-400 line-through'
                                    : 'text-white'
                                }`}
                              >
                                Day {task.taskNumber}: {task.title}
                              </h3>
                              <span className="text-xs text-slate-400 whitespace-nowrap">
                                {task.estimatedTime}
                              </span>
                            </div>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-slate-600/50 space-y-4 overflow-visible"
                              >
                                {/* Topic Overview Section */}
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg flex-shrink-0">
                                      <BookOpen className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-semibold text-slate-200 mb-1">
                                        Topic Overview
                                      </h4>
                                      <p className="text-sm text-slate-400 leading-relaxed">
                                        {task.description}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>

                                {/* Learning Resources Section */}
                                {task.resources && task.resources.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                        <Rocket className="w-4 h-4 text-blue-400" />
                                      </div>
                                      <h4 className="text-sm font-semibold text-slate-200">
                                        Learning Resources
                                      </h4>
                                      <span className="ml-auto text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                                        {task.resources.length} resources
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {task.resources.map((resource, ridx) => {
                                        const getResourceIcon = (type?: string) => {
                                          switch (type) {
                                            case 'video':
                                              return <Video className="w-5 h-5" />;
                                            case 'tutorial':
                                              return <BookOpen className="w-5 h-5" />;
                                            case 'documentation':
                                              return <FileText className="w-5 h-5" />;
                                            case 'article':
                                              return <FileText className="w-5 h-5" />;
                                            case 'interactive':
                                              return <Lightbulb className="w-5 h-5" />;
                                            default:
                                              return <ExternalLink className="w-5 h-5" />;
                                          }
                                        };

                                        const getPlatformColor = (platform?: string) => {
                                          switch (platform?.toLowerCase()) {
                                            case 'mdn':
                                              return 'from-blue-600 to-blue-700 text-blue-100';
                                            case 'w3schools':
                                              return 'from-green-600 to-green-700 text-green-100';
                                            case 'youtube':
                                              return 'from-red-600 to-red-700 text-red-100';
                                            case 'udemy':
                                              return 'from-purple-600 to-purple-700 text-purple-100';
                                            case 'freecodecamp':
                                              return 'from-indigo-600 to-indigo-700 text-indigo-100';
                                            default:
                                              return 'from-slate-600 to-slate-700 text-slate-100';
                                          }
                                        };

                                        return (
                                          <motion.div
                                            key={ridx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 + ridx * 0.05 }}
                                            className="group relative rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/50 hover:border-blue-500/40 transition-all duration-300 overflow-visible hover:shadow-lg hover:shadow-blue-500/10 p-4"
                                          >
                                            {/* Background glow on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                                            
                                            <div className="relative z-10 flex flex-col gap-3">
                                              {/* Top Section: Icon & Title */}
                                              <div className="flex items-start gap-3">
                                                {/* Resource Type Icon */}
                                                <div className="p-2.5 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-lg flex-shrink-0 transition-colors duration-300 text-blue-400">
                                                  {getResourceIcon(resource.type)}
                                                </div>

                                                {/* Title & Platform Badge */}
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors duration-300 line-clamp-2">
                                                    {resource.title || `Resource ${ridx + 1}`}
                                                  </p>
                                                  {resource.platform && (
                                                    <span
                                                      className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(
                                                        resource.platform
                                                      )} mt-2`}
                                                    >
                                                      {resource.platform}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Description */}
                                              {resource.description && (
                                                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 line-clamp-2 flex-grow">
                                                  {resource.description}
                                                </p>
                                              )}

                                              {/* Open Button */}
                                              <button
                                                onClick={() => onSelectResource?.(resource, task.title)}
                                                className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600/60 to-blue-700/60 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                              >
                                                <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                View Resource
                                              </button>
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}

                                {/* Subtasks Section */}
                                {task.subtasks && task.subtasks.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-slate-600/30 rounded-lg p-4"
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                      </div>
                                      <h4 className="text-sm font-semibold text-slate-200">
                                        Learning Tasks
                                      </h4>
                                    </div>
                                    <ul className="space-y-2">
                                      {task.subtasks.map((subtask, sidx) => (
                                        <motion.li
                                          key={sidx}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.2 + sidx * 0.05 }}
                                          className="text-sm text-slate-300 flex items-center gap-3 pl-1"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0" />
                                          <span>{subtask}</span>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}

                                {/* Start Learning CTA Button */}
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.25 }}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => onStartLearning(skill)}
                                  className="w-full mt-2 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 group"
                                >
                                  <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                  Start Learning This Task
                                </motion.button>
                              </motion.div>
                            )}
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-slate-400 flex-shrink-0"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <GlassButton onClick={onBack} variant="secondary" className="flex-1">
            Back to Skills
          </GlassButton>
          {progress.progress < 100 && (
            <GlassButton
              onClick={() => onStartLearning(skill)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Continue Learning
            </GlassButton>
          )}
          {progress.progress === 100 && (
            <GlassButton
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
              disabled
            >
              ✓ Completed
            </GlassButton>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
