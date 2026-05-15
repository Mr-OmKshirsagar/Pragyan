// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import { sendError } from '@/utils/response';
import { config } from '@/config/env';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Structured error logging
  const isProduction = config.nodeEnv === 'production';

  if (err instanceof AppError) {
    // Operational errors – expected, don't log stack in production
    if (!isProduction || err.statusCode >= 500) {
      console.error(`[AppError] ${req.method} ${req.path} → ${err.statusCode}: ${err.message}`);
    }
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    console.warn(`[ParseError] ${req.method} ${req.path}: Invalid JSON body`);
    sendError(res, 400, 'Invalid request format – malformed JSON');
    return;
  }

  // Unexpected errors – always log with stack trace
  console.error(`[UnhandledError] ${req.method} ${req.path}`, {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  sendError(
    res,
    500,
    isProduction ? 'Internal server error' : err.message
  );
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
