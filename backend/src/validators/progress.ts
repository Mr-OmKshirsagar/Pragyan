import { z } from 'zod';

export const saveRoadmapProgressSchema = z.object({
  roadmapId: z.string().min(1, 'roadmapId is required'),
  completedTasks: z.array(z.string()).optional(),
  completedDays: z.array(z.string()).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  currentDay: z.number().int().min(1).optional(),
});

export const updateRoadmapTaskSchema = z.object({
  roadmapId: z.string().min(1, 'roadmapId is required'),
  totalTasks: z.number().int().min(1, 'totalTasks must be at least 1'),
  dayId: z.string().optional(),
  completed: z.boolean().optional(),
  xpReward: z.number().int().min(0).max(500).optional(),
});
