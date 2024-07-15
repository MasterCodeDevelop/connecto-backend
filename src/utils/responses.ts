import { Response } from 'express';
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
  data?: object,
  status: HttpStatusCode = OK,
): Response => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 *
 * @param res - Express Response object
 * @param message - Human-readable error message
 * @param status - HTTP status code (default: 500 Internal Server Error)
 * @param details - Optional metadata to help debug the error
 * @returns Express Response with structured JSON error payload
 */
export const errorResponse = (
  res: Response,
  message: string,
  status: HttpStatusCode = INTERNAL_SERVER_ERROR,
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
