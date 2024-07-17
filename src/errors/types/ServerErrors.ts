import { HttpError } from '../base/HttpError';
import { INTERNAL_SERVER_ERROR } from '@/utils';

/**
 * Error representing a generic internal server error.
 *
 * This is typically used when something unexpected fails on the server
 * and no more specific error type applies.
 * Corresponds to HTTP status 500.
 */
export class InternalError extends HttpError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(message, INTERNAL_SERVER_ERROR, details);
  }
}
