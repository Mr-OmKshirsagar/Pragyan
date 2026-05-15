import { z } from 'zod';

export const careerMatchingAnalyzeSchema = z.object({
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  personality: z.array(z.string()).optional(),
  workStyle: z.array(z.string()).optional(),
  careerGoals: z.array(z.string()).optional(),
});

export type CareerMatchingAnalyze = z.infer<typeof careerMatchingAnalyzeSchema>;
