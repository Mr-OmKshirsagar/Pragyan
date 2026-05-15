import { SkillProgress, LearningStreak, UserLearningStats } from '../types/roadmap';

// ============ LOCAL STORAGE KEYS ============
const SKILL_PROGRESS_PREFIX = 'pragyan_skill_progress_';
const USER_STATS_KEY = 'pragyan_user_stats';
const LEARNING_STREAK_PREFIX = 'pragyan_streak_';

// ============ PROGRESS TRACKING ============

export function getSkillProgress(skillId: string): SkillProgress | null {
  try {
    const stored = localStorage.getItem(`${SKILL_PROGRESS_PREFIX}${skillId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveSkillProgress(skillId: string, progress: SkillProgress): void {
  try {
    localStorage.setItem(
      `${SKILL_PROGRESS_PREFIX}${skillId}`,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error('Failed to save skill progress:', error);
  }
}

export function completeTask(skillId: string, taskId: string): SkillProgress {
  const progress = getSkillProgress(skillId) || createNewProgress(skillId);

  if (!progress.completedTasks.includes(taskId)) {
    progress.completedTasks.push(taskId);
    progress.progress = Math.min(100, (progress.completedTasks.length / 20) * 100);
    progress.xp += 10;

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (progress.streak.lastCompletedDay !== today) {
      progress.streak.lastCompletedDay = today;
      progress.streak.currentStreak++;
      progress.streak.totalDaysCompleted++;

      if (progress.streak.currentStreak > progress.streak.longestStreak) {
        progress.streak.longestStreak = progress.streak.currentStreak;
      }
    }

    saveSkillProgress(skillId, progress);
  }

  return progress;
}

export function uncompleteTask(skillId: string, taskId: string): SkillProgress {
  const progress = getSkillProgress(skillId) || createNewProgress(skillId);

  progress.completedTasks = progress.completedTasks.filter((id) => id !== taskId);
  progress.progress = Math.min(100, (progress.completedTasks.length / 20) * 100);
  progress.xp = Math.max(0, progress.xp - 10);

  saveSkillProgress(skillId, progress);
  return progress;
}

export function createNewProgress(skillId: string): SkillProgress {
  const now = new Date().toISOString();
  return {
    skillId,
    progress: 0,
    currentDay: 1,
    xp: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
    },
    completedTasks: [],
    startedAt: now,
  };
}

// ============ STREAK TRACKING ============

export function getOrCreateStreak(skillId: string): LearningStreak {
  try {
    const stored = localStorage.getItem(`${LEARNING_STREAK_PREFIX}${skillId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Continue to create new
  }

  const newStreak: LearningStreak = {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
  };

  saveStreak(skillId, newStreak);
  return newStreak;
}

export function saveStreak(skillId: string, streak: LearningStreak): void {
  try {
    localStorage.setItem(
      `${LEARNING_STREAK_PREFIX}${skillId}`,
      JSON.stringify(streak)
    );
  } catch (error) {
    console.error('Failed to save streak:', error);
  }
}

export function updateStreak(skillId: string): LearningStreak {
  const streak = getOrCreateStreak(skillId);
  const today = new Date().toISOString().split('T')[0];

  if (streak.lastCompletedDay !== today) {
    streak.lastCompletedDay = today;
    streak.currentStreak++;
    streak.totalDaysCompleted++;

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    saveStreak(skillId, streak);
  }

  return streak;
}

// ============ XP & POINTS ============

export function calculateXPForDay(taskCount: number): number {
  return taskCount * 10; // 10 XP per task
}

export function calculateTotalXP(completedTasks: number): number {
  return completedTasks * 10;
}

// ============ DAILY TASKS LOGIC ============

export function getCurrentDayNumber(completedTasks: number, totalTasks: number = 28): number {
  return Math.min(Math.floor(completedTasks / 1) + 1, totalTasks);
}

export function getProgressPercentage(
  completedTasks: number,
  totalTasks: number = 28
): number {
  return Math.round((completedTasks / totalTasks) * 100);
}

export function shouldUnlockNextDay(
  currentDayTasks: number,
  completedInCurrentDay: number
): boolean {
  return completedInCurrentDay >= currentDayTasks;
}

export function getTasksForDay(
  allTasks: any[],
  dayNumber: number,
  tasksPerDay: number = 1
): any[] {
  const startIndex = (dayNumber - 1) * tasksPerDay;
  const endIndex = startIndex + tasksPerDay;
  return allTasks.slice(startIndex, endIndex);
}

// ============ STREAK CALCULATIONS ============

export function getStreakMessage(streakDays: number): string {
  if (streakDays === 0) return 'Start your streak today!';
  if (streakDays === 1) return '🔥 1 day streak! Keep going!';
  if (streakDays < 7) return `🔥 ${streakDays} days! You\'re on fire!`;
  if (streakDays < 30) return `⚡ ${streakDays} days! Amazing progress!`;
  if (streakDays < 100) return `🌟 ${streakDays} days! Incredible dedication!`;
  return `👑 ${streakDays} days! You\'re a learning machine!`;
}

// ============ ACHIEVEMENTS ============

export interface AchievementProgress {
  achieved: boolean;
  unlockedAt?: string;
}

export function checkAchievements(skillProgress: SkillProgress): string[] {
  const achievements: string[] = [];

  // 5 day streak
  if (skillProgress.streak.currentStreak >= 5) {
    achievements.push('streak-5-days');
  }

  // 10 day streak
  if (skillProgress.streak.currentStreak >= 10) {
    achievements.push('streak-10-days');
  }

  // 5 tasks completed
  if (skillProgress.completedTasks.length >= 5) {
    achievements.push('5-tasks-completed');
  }

  // 50% progress
  if (skillProgress.progress >= 50) {
    achievements.push('halfway-there');
  }

  // 100% progress (completed)
  if (skillProgress.progress === 100) {
    achievements.push('skill-master');
  }

  return achievements;
}

export const achievementMetadata: Record<string, { title: string; description: string; icon: string }> = {
  'streak-5-days': {
    title: 'Weekly Warrior',
    description: 'Complete tasks for 5 consecutive days',
    icon: '🔥',
  },
  'streak-10-days': {
    title: 'Unstoppable',
    description: 'Complete tasks for 10 consecutive days',
    icon: '⚡',
  },
  '5-tasks-completed': {
    title: 'Quick Learner',
    description: 'Complete 5 tasks',
    icon: '🚀',
  },
  'halfway-there': {
    title: 'Halfway There',
    description: 'Reach 50% completion',
    icon: '📈',
  },
  'skill-master': {
    title: 'Skill Master',
    description: 'Complete 100% of the skill',
    icon: '👑',
  },
};

// ============ TIME ESTIMATES ============

export function calculateRemainingTime(completedTasks: number, totalTasks: number, estimatedHours: number): string {
  const remainingTasks = totalTasks - completedTasks;
  const hoursPerTask = estimatedHours / totalTasks;
  const remainingHours = remainingTasks * hoursPerTask;

  if (remainingHours < 1) {
    return 'Less than 1 hour';
  }

  if (remainingHours < 24) {
    return `${Math.ceil(remainingHours)} hours`;
  }

  const days = Math.ceil(remainingHours / 24);
  return `${days} days`;
}

export function formatEstimatedTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }

  if (hours < 24) {
    return `${Math.round(hours)} hours`;
  }

  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);

  if (weeks > 0) {
    return `${weeks} weeks`;
  }

  return `${days} days`;
}
