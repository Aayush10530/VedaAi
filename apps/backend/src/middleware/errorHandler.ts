import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code = 'INTERNAL_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(msg: string) {
    super(msg, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(msg: string) {
    super(msg, 400, 'VALIDATION_ERROR');
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
