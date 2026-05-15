import { z } from 'zod';

export const recommendationProfileSchema = z
  .object({
    skills: z.array(z.string().min(1)).optional(),
    interests: z.array(z.string().min(1)).optional(),
    personality: z.array(z.string().min(1)).optional(),
    education: z.string().min(1).optional(),
    experience: z.string().min(1).optional(),
    workStyle: z.array(z.string().min(1)).optional(),
    learningPreferences: z.array(z.string().min(1)).optional(),
  })
  .partial();
