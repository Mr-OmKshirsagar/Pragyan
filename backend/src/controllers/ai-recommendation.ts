// src/controllers/ai-recommendation.ts

import { Request, Response } from 'express';
import { aiRecommendationService } from '@/services/ai-recommendation';
import { sendSuccess, sendError } from '@/utils/response';
import { asyncHandler } from '@/middleware/errorHandler';

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const recommendations = await aiRecommendationService.recommendCareers(req.user.id);

  return sendSuccess(res, recommendations, 200, 'Career recommendations fetched');
});

export const getRecommendedRoadmaps = asyncHandler(async (req: Request, res: Response) => {
  const { career } = req.params;

  if (!career) {
    return sendError(res, 400, 'Career parameter is required');
  }

  const roadmaps = await aiRecommendationService.getRecommendedRoadmaps(career);

  return sendSuccess(res, roadmaps, 200, 'Recommended roadmaps fetched');
});

export const getPersonalizedRoadmap = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { careerGoal, skillLevel } = req.body;

  if (!careerGoal || !skillLevel) {
    return sendError(res, 400, 'careerGoal and skillLevel are required');
  }

  const roadmaps = await aiRecommendationService.generatePersonalizedRoadmap(
    req.user.id,
    careerGoal,
    skillLevel
  );

  return sendSuccess(res, roadmaps, 200, 'Personalized roadmaps generated');
});
