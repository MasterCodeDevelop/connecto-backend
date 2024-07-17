import { Response, Request } from 'express';
import type { HttpStatusCode } from './httpStatus';
import { INTERNAL_SERVER_ERROR, OK } from './httpStatus';

/**
 * Sends a standardized successful response.
 *
 * @param res - Express response object
 * @param message - Human-readable success message
 * @param data - Optional payload to return
 * @param status - Optional HTTP status code (default: 200 OK)
 * @returns Express Response with formatted JSON
 */
export const successResponse = (
  res: Response,
  message: string,
  data: Record<string, unknown> | null = null,
  status: HttpStatusCode = OK,
): Response => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Interface for the error payload.
 */
interface ErrorPayload {
  name: string;
  message: string;
  code: number;
  timestamp: string;
  path: string;
  method: string;
  details?: Record<string, unknown>;
}

/**
 * Sends a standardized and structured error response.
 *
 * This utility is designed to provide consistent and debuggable error messages
 * across your API. It includes optional metadata such as request path, method,
 * timestamp and developer-friendly details for better observability.
 *
 * @param req - Express Request object to extract request context (path, method).
 * @param res - Express Response object used to send the JSON error response.
 * @param message - Human-readable message describing the error.
 * @param status - HTTP status code (default: 500 - Internal Server Error).
 * @param name - Error type identifier, typically the class name (e.g., "NotFoundError").
 * @param details - Optional additional context (e.g., failed validation fields, stack trace).
 *
 * @returns Formatted Express error response
 */
export const errorResponse = (
  req: Request,
  res: Response,
  message: string,
  status: HttpStatusCode = INTERNAL_SERVER_ERROR,
  name = 'Error',
  details?: Record<string, unknown>,
): Response => {
  // Get current timestamp
  const timestamp = new Date().toISOString();

  // Build the base error response
  const errorPayload: ErrorPayload = {
    name,
    message,
    code: status,
    timestamp,
    path: req.originalUrl,
    method: req.method,
  };

  // Only include details if they are defined
  if (details) {
    errorPayload.details = details;
  }

  return res.status(status).json({
    success: false,
    error: errorPayload,
  });
};
