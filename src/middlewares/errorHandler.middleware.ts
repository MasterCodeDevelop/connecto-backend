/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { HttpError } from '@/errors';
import { errorResponse, INTERNAL_SERVER_ERROR, parseStackTrace } from '@/utils';
import { logger } from '@/config/logger';

/**
 * Global error-handling middleware for Express applications.
 *
 * This middleware catches all errors thrown during the request lifecycle.
 * It normalizes the error response, logs structured metadata (including parsed stack trace),
 * and ensures sensitive error details are hidden from clients in production.
 *
 * @param err - The caught error object
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next): void => {
  const isHttpError = err instanceof HttpError;

  // Extract safe metadata if error is a plain object
  const details: Record<string, unknown> | undefined =
    typeof err === 'object' && err !== null && !Array.isArray(err)
      ? (err as Record<string, unknown>)
      : undefined;

  // Determine error properties for response
  const message = isHttpError ? err.message : 'Internal Server Error';
  const statusCode = isHttpError ? err.statusCode : INTERNAL_SERVER_ERROR;
  const name = isHttpError ? err.name : 'InternalServerError';

  // Parse relevant location from stack trace
  const stackInfo = parseStackTrace(err.stack);

  // Build structured log context
  const logContext = {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    location: stackInfo,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
    message,
    name,
  };

  // Log the error with level based on type
  if (isHttpError) {
    logger.warn(`[Handled Error] ${name}: ${message}`, { ...logContext });
  } else {
    logger.error('Unhandled Error', { ...logContext });
  }

  // Send error response to client
  errorResponse(req, res, message, statusCode, name, details);
};
