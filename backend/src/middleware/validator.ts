// src/middleware/validator.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '@/utils/errors';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(error.message);
        });
        throw new BadRequestError('Validation failed', errors);
      }

      if (source === 'body') {
        req.body = result.data;
      } else if (source === 'query') {
        req.query = result.data;
      } else {
        req.params = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
