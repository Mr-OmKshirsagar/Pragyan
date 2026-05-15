// src/utils/response.ts

import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message: string = 'Success'
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  } as PaginatedResponse<T>);
};
