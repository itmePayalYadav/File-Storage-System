// ==============================
// Error Handler Middleware
// ==============================
import { ZodError } from 'zod';
import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError, NotFound } from '@/utils/error';
import { Request, Response, NextFunction } from 'express';

// ==============================
// Zod Error Formatter
// ==============================
const formatedZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
  }));
  return res.status(StatusCodes.BAD_REQUEST).json({
    message: 'Validation error',
    status: 'error',
    errors,
  });
};

// ==============================
// Global Error Middleware
// ==============================
export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid JSON syntax',
    });
    return;
  }

  if (error instanceof ZodError) {
    return formatedZodError(res, error);
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

// ==============================
// Not Found Middleware
// ==============================
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new NotFound(`Route ${req.originalUrl} not found.`));
};
