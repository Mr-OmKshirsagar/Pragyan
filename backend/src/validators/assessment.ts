import { z } from 'zod';

export const assessmentAnswersSchema = z.object({
  answers: z.record(z.string(), z.string()).refine((value) => Object.keys(value).length > 0, {
    message: 'At least one assessment answer is required',
  }),
});

export type AssessmentAnswersInput = z.infer<typeof assessmentAnswersSchema>;

export const assessmentCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      questionText: z.string().min(1),
      options: z.array(z.string()).min(1),
      category: z.string().optional(),
    })
  ).min(1),
});

export type AssessmentCreateInput = z.infer<typeof assessmentCreateSchema>;
