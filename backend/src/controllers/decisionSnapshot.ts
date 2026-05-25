import { Request, Response } from 'express';
import { sendSuccess, sendError } from '@/utils/response';
import { asyncHandler } from '@/middleware/errorHandler';
import { decisionSnapshotService } from '@/services/decisionSnapshot';

export const createSnapshot = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return sendError(res, 401, 'Unauthorized');
  const { snapshot } = req.body || {};
  if (!snapshot) return sendError(res, 400, 'snapshot is required');
  const created = await decisionSnapshotService.createSnapshot(req.user.id, snapshot);
  return sendSuccess(res, created, 201, 'Decision snapshot recorded');
});

export const getSnapshots = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) return sendError(res, 401, 'Unauthorized');
  const limit = Number(req.query.limit || 50);
  const list = await decisionSnapshotService.getSnapshots(req.user.id, limit);
  return sendSuccess(res, list, 200, 'Decision snapshots fetched');
});
