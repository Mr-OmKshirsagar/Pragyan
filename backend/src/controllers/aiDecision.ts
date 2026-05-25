import { Request, Response } from 'express';
import { aiDecisionEngine } from '@/services/ai-decision-engine';
import { sendSuccess, sendError } from '@/utils/response';

export async function evaluate(req: Request, res: Response) {
  try {
    const userId = req.user?.id as string;
    const result = await aiDecisionEngine.evaluateRecommendations(userId);
    return sendSuccess(res, result, 200, 'Adaptive recommendations evaluated');
  } catch (e) {
    return sendError(res, 500, 'Failed to evaluate adaptive recommendations', typeof e === 'object' && (e as any).errors ? (e as any).errors : undefined);
  }
}
