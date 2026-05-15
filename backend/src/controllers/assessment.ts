// src/controllers/assessment.ts

import { Request, Response } from 'express';
import { assessmentService } from '@/services/assessment';
import { sendSuccess, sendError } from '@/utils/response';
import { asyncHandler } from '@/middleware/errorHandler';

export const getQuestions = asyncHandler(async (_req: Request, res: Response) => {
  const questions = await assessmentService.getQuestions();

  return sendSuccess(res, questions, 200, 'Questions fetched successfully');
});

export const getQuestionsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const questions = await assessmentService.getQuestionsByCategory(category);

  return sendSuccess(res, questions, 200, 'Questions fetched successfully');
});

export const submitAssessment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { answers } = req.body;

  if (!answers || typeof answers !== 'object') {
    return sendError(res, 400, 'Invalid answers format');
  }

  const result = await assessmentService.submitAssessment(req.user.id, answers);

  return sendSuccess(res, result, 201, 'Assessment submitted successfully');
});

export const getAssessmentResult = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { resultId } = req.params;
  const result = await assessmentService.getAssessmentResult(req.user.id, resultId);

  return sendSuccess(res, result, 200, 'Assessment result fetched successfully');
});

export const saveAssessment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const { answers } = req.body;

  if (!answers || typeof answers !== 'object') {
    return sendError(res, 400, 'Invalid answers format');
  }

  const result = await assessmentService.saveAssessmentSession(req.user.id, answers);
  return sendSuccess(res, result, 201, 'Assessment saved successfully');
});

export const getAssessmentHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const history = await assessmentService.getAssessmentHistory(req.user.id);
  return sendSuccess(res, history, 200, 'Assessment history fetched successfully');
});

export const getLatestAssessment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  const latest = await assessmentService.getLatestAssessment(req.user.id);
  return sendSuccess(res, latest, 200, 'Latest assessment fetched successfully');
});

export const createAssessment = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return sendError(res, 400, 'Invalid payload: title and questions are required');
  }

  const created = await assessmentService.createAssessment({ title, description, questions });
  return sendSuccess(res, created, 201, 'Assessment created successfully');
});
