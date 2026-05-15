// src/services/roadmap.ts

import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/utils/errors';
import { CreateRoadmapInput, SearchRoadmapInput } from '@/validators/roadmap';

export class RoadmapService {
  async createRoadmap(input: CreateRoadmapInput) {
    const roadmap = await prisma.roadmap.create({
      data: {
        title: input.title,
        category: input.category,
        description: input.description,
        level: input.level,
        duration: input.duration,
        icon: input.icon || '📚',
        estimatedHours: input.estimatedHours,
        tags: input.tags || [],
      },
    });

    return roadmap;
  }

  async getRoadmapById(id: string) {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        weeks: {
          include: {
            days: {
              include: {
                tasks: true,
              },
            },
          },
          orderBy: {
            weekNumber: 'asc',
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundError('Roadmap not found');
    }

    return roadmap;
  }

  async getAllRoadmaps(input: SearchRoadmapInput) {
    const { query, category, level, page, limit } = input;

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.roadmap.count({ where }),
    ]);

    return {
      roadmaps,
      total,
      page,
      limit,
    };
  }

  async getRoadmapsByCategory(category: string, page: number = 1, limit: number = 10) {
    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where: { category },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.roadmap.count({ where: { category } }),
    ]);

    return {
      roadmaps,
      total,
      page,
      limit,
    };
  }

  async updateRoadmap(id: string, input: Partial<CreateRoadmapInput>) {
    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: input,
    });

    return roadmap;
  }

  async deleteRoadmap(id: string) {
    await prisma.roadmap.delete({
      where: { id },
    });
  }

  async searchRoadmaps(query: string) {
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      take: 20,
    });

    return roadmaps;
  }

  async getCategories() {
    const categories = await prisma.roadmap.findMany({
      distinct: ['category'],
      select: { category: true },
    });

    return categories.map((r) => r.category);
  }
}

export const roadmapService = new RoadmapService();
