// src/controllers/progress.ts

import { Request, Response } from 'express';
import { progressService } from '@/services/progress';
import { sendSuccess, sendError } from '@/utils/response';
import { asyncHandler } from '@/middleware/errorHandler';

export const getProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { roadmapId } = req.params;
  const progress = await progressService.getUserProgress(req.user.id, roadmapId);

  return sendSuccess(res, progress, 200, 'Progress fetched successfully');
});

export const completeTask = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { roadmapId, taskId } = req.body;

  if (!roadmapId || !taskId) {
    return sendError(res, 400, 'roadmapId and taskId are required');
  }

  const progress = await progressService.completeTask(req.user.id, roadmapId, taskId);

  return sendSuccess(res, progress, 200, 'Task completed successfully');
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const dashboardData = await progressService.getDashboardData(req.user.id);

  return sendSuccess(res, dashboardData, 200, 'Dashboard data fetched successfully');
});

export const completeRoadmap = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { roadmapId } = req.body;

  if (!roadmapId) {
    return sendError(res, 400, 'roadmapId is required');
  }

  const completed = await progressService.completeRoadmap(req.user.id, roadmapId);

  return sendSuccess(res, completed, 200, 'Roadmap marked as completed');
});
