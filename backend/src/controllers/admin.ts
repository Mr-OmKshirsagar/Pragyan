import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendError, sendSuccess } from '@/utils/response';

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    activeUsers,
    roadmapCount,
    skillCount,
    assessmentCount,
    resourceCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
    prisma.roadmap.count(),
    prisma.skill.count(),
    prisma.assessmentSession.count(),
    prisma.resource.count(),
  ]);

  return sendSuccess(res, {
    totalUsers,
    activeUsers,
    roadmapCount,
    skillCount,
    assessmentCount,
    resourceCount,
  }, 200, 'Admin dashboard analytics fetched');
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      xp: true,
      streak: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 500,
  });

  return sendSuccess(res, users, 200, 'Users fetched');
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body as { role?: string };

  if (!role || !['USER', 'ADMIN'].includes(role)) {
    return sendError(res, 400, 'Role must be USER or ADMIN');
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return sendSuccess(res, user, 200, 'User role updated');
});

export const getRoadmapStats = asyncHandler(async (_req: Request, res: Response) => {
  const [roadmaps, userProgress] = await Promise.all([
    prisma.roadmap.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        title: true,
        category: true,
        level: true,
        estimatedHours: true,
        createdAt: true,
      },
    }),
    prisma.userProgress.findMany({
      select: {
        roadmapId: true,
        progressPercentage: true,
        completedTasks: true,
      },
    }),
  ]);

  return sendSuccess(res, { roadmaps, userProgress }, 200, 'Roadmap stats fetched');
});

export const getResources = asyncHandler(async (_req: Request, res: Response) => {
  const resources = await prisma.resource.findMany({
    include: {
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  return sendSuccess(res, resources, 200, 'Resources fetched');
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const { taskId, title, url, description, platform, type } = req.body as {
    taskId?: string;
    title?: string;
    url?: string;
    description?: string;
    platform?: string;
    type?: string;
  };

  if (!taskId || !title || !url || !platform || !type) {
    return sendError(res, 400, 'taskId, title, url, platform, and type are required');
  }

  const resource = await prisma.resource.create({
    data: {
      taskId,
      title,
      url,
      description,
      platform,
      type,
    },
  });

  return sendSuccess(res, resource, 201, 'Resource created');
});

export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, url, description, platform, type } = req.body as {
    title?: string;
    url?: string;
    description?: string;
    platform?: string;
    type?: string;
  };

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(url !== undefined ? { url } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(platform !== undefined ? { platform } : {}),
      ...(type !== undefined ? { type } : {}),
    },
  });

  return sendSuccess(res, resource, 200, 'Resource updated');
});

export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.resource.delete({ where: { id } });

  return sendSuccess(res, { id }, 200, 'Resource deleted');
});

export const getAssessmentAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const assessments = await prisma.assessmentSession.findMany({
    orderBy: { completedAt: 'desc' },
    take: 200,
    select: {
      id: true,
      userId: true,
      selectedOptions: true,
      completedAt: true,
      createdAt: true,
    },
  });

  return sendSuccess(res, assessments, 200, 'Assessment analytics fetched');
});
