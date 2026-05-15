import { apiFetch } from './api';

export interface RoadmapProgressRecord {
  id: string;
  userId: string;
  roadmapId: string;
  completedTasks: string[];
  completedDays: string[];
  progressPercentage: number;
  currentDay: number;
  xp: number;
  streak: number;
  lastActiveDate?: string;
}

export async function fetchRoadmapProgress(roadmapId?: string) {
  const query = roadmapId ? `?roadmapId=${encodeURIComponent(roadmapId)}` : '';
  const response = await apiFetch<{ data: RoadmapProgressRecord | RoadmapProgressRecord[] }>(`/api/roadmaps/progress${query}`, undefined, { auth: true });
  return response.data;
}

export async function saveRoadmapProgress(payload: {
  roadmapId: string;
  completedTasks?: string[];
  completedDays?: string[];
  progressPercentage?: number;
  currentDay?: number;
}) {
  const response = await apiFetch<{ data: RoadmapProgressRecord }>('/api/roadmaps/progress', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { auth: true });

  return response.data;
}

export async function updateRoadmapTask(taskId: string, payload: {
  roadmapId: string;
  totalTasks: number;
  dayId?: string;
  completed?: boolean;
  xpReward?: number;
}) {
  const response = await apiFetch<{ data: { progress: RoadmapProgressRecord; user?: { xp: number; streak: number } } }>(`/api/roadmaps/task/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { auth: true });

  return response.data;
}
