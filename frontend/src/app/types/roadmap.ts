// ============ RESOURCE TYPE ============
export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string; // short description of the resource
  platform?: string; // e.g., "MDN", "W3Schools", "YouTube"
  type?: 'documentation' | 'tutorial' | 'video' | 'article' | 'interactive'; // resource type
}

// ============ ROADMAP TYPES ============

export interface DailyTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  completed: boolean;
  estimatedTime: string; // e.g., "30 mins", "1 hour"
  subtasks?: string[]; // e.g., ["Learn basics", "Practice exercises", "Build mini project"]
  resources?: Resource[]; // e.g., links to tutorials with metadata
  completed_at?: string; // ISO timestamp
}

export interface WeeklyModule {
  week: number;
  title: string;
  topics: string[];
  estimatedHours: number;
}

export interface SkillRoadmap {
  id: string;
  skillName: string;
  skillCategory: 'frontend' | 'backend' | 'fullstack' | 'tools' | 'concepts';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  totalDuration: string; // e.g., "4 weeks", "30 days"
  estimatedHours: number;
  progress: number; // 0-100
  currentDay: number; // current day number
  totalDays: number;
  weeklyModules: WeeklyModule[];
  dailyTasks: DailyTask[];
  prerequisites?: string[]; // skill IDs
  relatedSkills?: string[]; // skill IDs
  icon: string;
  color: 'primary' | 'secondary' | 'accent' | 'success';
  lastAccessedAt?: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDay?: string; // ISO date
  totalDaysCompleted: number;
}

export interface SkillProgress {
  skillId: string;
  progress: number; // 0-100
  currentDay: number;
  xp: number;
  streak: LearningStreak;
  completedTasks: string[]; // task IDs
  completedDays?: string[];
  achievements?: string[];
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
}

export interface UserLearningStats {
  totalSkillsStarted: number;
  totalSkillsCompleted: number;
  totalHoursLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalXPEarned: number;
  skillProgress: Map<string, SkillProgress>; // skillId -> progress
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string; // ISO timestamp
  type: 'milestone' | 'streak' | 'skill_completion' | 'daily_goal';
}

export interface SkillChip {
  id: string;
  name: string;
  stage: string; // e.g., "Beginner", "Intermediate"
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  progress: number; // 0-100
}
