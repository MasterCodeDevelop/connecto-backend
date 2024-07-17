/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { HttpError } from '@/errors'; // Grâce à tsconfig paths
import { errorResponse, INTERNAL_SERVER_ERROR } from '@/utils';

/**
 * Global error handling middleware for Express.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next): void => {
  // Safely extract details if the error is a plain object
  const details: Record<string, unknown> | undefined =
    typeof err === 'object' && err !== null && !Array.isArray(err)
      ? (err as Record<string, unknown>)
      : undefined;

  // Define response payload components
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';
  const statusCode = err instanceof HttpError ? err.statusCode : INTERNAL_SERVER_ERROR;
  const name = err instanceof HttpError ? err.name : 'InternalServerError';

  // Log only unhandled or unknown errors
  if (!(err instanceof HttpError)) {
    console.error('[Unhandled Error]', err);
  }

  // Unified response output
  errorResponse(req, res, message, statusCode, name, details);
};
