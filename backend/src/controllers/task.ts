// src/controllers/task.ts

import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { asyncHandler } from '@/middleware/errorHandler';

export const getTasksBySkill = asyncHandler(async (req: Request, res: Response) => {
  const { skillId } = req.params;

  const tasks = await prisma.dailyTask.findMany({
    where: { skillId },
    include: {
      resources: true,
    },
    orderBy: {
      taskNumber: 'asc',
    },
  });

  res.json({
    success: true,
    data: tasks,
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.dailyTask.findUnique({
    where: { id },
    include: {
      resources: true,
    },
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  return res.json({
    success: true,
    data: task,
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    skillId,
    taskNumber,
    title,
    description,
    estimatedTime,
    subtasks,
    resources,
  } = req.body;

  const task = await prisma.dailyTask.create({
    data: {
      skillId,
      taskNumber,
      title,
      description,
      estimatedTime,
      subtasks: subtasks || [],
      resources: resources ? {
        createMany: {
          data: resources,
        },
      } : undefined,
    },
    include: {
      resources: true,
    },
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

export const updateTaskProgress = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { completed, userId } = req.body as { completed?: boolean; userId?: string };
  const progressUserId = userId || req.params.skillId;

  if (!progressUserId) {
    return res.status(400).json({
      success: false,
      message: 'userId is required',
    });
  }

  const taskProgress = await prisma.taskProgress.upsert({
    where: {
      userId_taskId: {
        userId: progressUserId,
        taskId,
      },
    },
    create: {
      userId: progressUserId,
      taskId,
      completed: completed ?? false,
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed: completed ?? false,
      completedAt: completed ? new Date() : null,
    },
  });

  return res.json({
    success: true,
    data: taskProgress,
  });
});
