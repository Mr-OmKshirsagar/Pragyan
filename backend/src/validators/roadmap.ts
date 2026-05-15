// src/validators/roadmap.ts

import { z } from 'zod';

export const createRoadmapSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  duration: z.string().min(1, 'Duration is required'),
  icon: z.string().optional(),
  estimatedHours: z.number().positive('Estimated hours must be positive'),
  tags: z.array(z.string()).optional(),
});

export const getRoadmapSchema = z.object({
  id: z.string().cuid(),
});

export const searchRoadmapSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type SearchRoadmapInput = z.infer<typeof searchRoadmapSchema>;
