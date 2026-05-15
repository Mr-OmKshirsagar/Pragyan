// src/controllers/skill.ts

import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { asyncHandler } from '@/middleware/errorHandler';

export const getSkills = asyncHandler(async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({
    include: {
      weeklyModules: true,
      dailyTasks: {
        include: {
          resources: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: skills,
  });
});

export const getSkillById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      weeklyModules: true,
      dailyTasks: {
        include: {
          resources: true,
        },
      },
    },
  });

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: 'Skill not found',
    });
  }

  return res.json({
    success: true,
    data: skill,
  });
});

export const getSkillByName = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.params;

  const skill = await prisma.skill.findUnique({
    where: { skillName: name },
    include: {
      weeklyModules: true,
      dailyTasks: {
        include: {
          resources: true,
        },
      },
    },
  });

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: 'Skill not found',
    });
  }

  return res.json({
    success: true,
    data: skill,
  });
});

export const getSkillsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const skills = await prisma.skill.findMany({
    where: {
      skillCategory: category,
    },
    include: {
      weeklyModules: true,
      dailyTasks: {
        include: {
          resources: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: skills,
  });
});

export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const {
    skillName,
    skillCategory,
    difficulty,
    description,
    totalDuration,
    estimatedHours,
    icon,
    color,
    prerequisites,
    relatedSkills,
    totalDays,
  } = req.body;

  const skill = await prisma.skill.create({
    data: {
      skillName,
      skillCategory,
      difficulty,
      description,
      totalDuration,
      estimatedHours,
      icon,
      color,
      prerequisites: prerequisites || [],
      relatedSkills: relatedSkills || [],
      totalDays,
    },
  });

  res.status(201).json({
    success: true,
    data: skill,
  });
});
