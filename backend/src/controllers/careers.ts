import { Request, Response } from 'express';
import { adaptiveAssessmentService } from '@/services/adaptive-assessment';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendError, sendSuccess } from '@/utils/response';

export const getCareers = asyncHandler(async (_req: Request, res: Response) => {
  const careers = await adaptiveAssessmentService.getCareers();
  return sendSuccess(res, careers, 200, 'Careers fetched successfully');
});

export const getCareerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const career = await adaptiveAssessmentService.getCareerById(id);
  if (!career) {
    return sendError(res, 404, 'Career not found');
  }

  return sendSuccess(res, career, 200, 'Career fetched successfully');
});
