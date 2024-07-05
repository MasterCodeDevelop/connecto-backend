import { Response } from 'express';
import type { HttpStatusCode } from './httpStatus';

/**
 * Sends a standardized error response.
 *
 * @param res - Express Response object
 * @param message - Human-readable error message
 * @param status - HTTP status code (default: 500 Internal Server Error)
 * @param details - Optional metadata to help debug the error
 * @returns Express Response with structured JSON error payload
 */
const errorResponse = (
  res: Response,
  message: string,
  status: HttpStatusCode = 500,
  details?: unknown,
): Response => {
  const responseBody: Record<string, unknown> = {
    error: true,
    message,
    code: status,
  };

  if (details) {
    responseBody.details = details;
  }

  return res.status(status).json(responseBody);
};

export default errorResponse;
