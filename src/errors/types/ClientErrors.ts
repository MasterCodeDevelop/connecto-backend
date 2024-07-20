import { HttpError } from '../base/HttpError';
import { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT, FORBIDDEN } from '@/utils';

/**
 * Error thrown when client sends an invalid request.
 * Corresponds to HTTP status 400.
 */
export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', details?: unknown) {
    super(message, BAD_REQUEST, details);
  }
}

/**
 * Error thrown when a user lacks the required permissions.
 * Corresponds to HTTP status 401.
 */
export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized access', details?: unknown) {
    super(message, UNAUTHORIZED, details);
  }
}

/**
 * Error thrown when a user lacks the required permissions.
 * Corresponds to HTTP status 403.
 */
export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden access', details?: unknown) {
    super(message, FORBIDDEN, details);
  }
}

/**
 * Error thrown when a requested resource cannot be found.
 * Corresponds to HTTP status 404.
 */
export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, NOT_FOUND, details);
  }
}

/**
 * Error thrown when a resource already exists.
 * Corresponds to HTTP status 409.
 */
export class ConflictError extends HttpError {
  constructor(message = 'Resource already exists', details?: unknown) {
    super(message, CONFLICT, details);
  }
}
