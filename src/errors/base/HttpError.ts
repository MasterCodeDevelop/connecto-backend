import { HttpStatusCode } from '@/utils';
import { INTERNAL_SERVER_ERROR } from '@/utils';

/**
 * Abstract base class for all custom HTTP errors.
 *
 * This class extends the native JavaScript `Error` object with:
 * - An HTTP status code (default: 500),
 * - Optional additional details (can be used for logging or debugging),
 * - Proper prototype chain handling (for instanceof support).
 *
 * All custom HTTP error types (e.g., 400, 404, 409) should extend from this base class.
 */
export class HttpError extends Error {
  public statusCode: HttpStatusCode;
  public details?: unknown;

  /**
   * Creates a new instance of `HttpError`.
   *
   * @param message - A human-readable error message.
   * @param statusCode - HTTP status code associated with the error (default: 500).
   * @param details - Optional metadata or context related to the error.
   */
  constructor(
    message: string,
    statusCode: HttpStatusCode = INTERNAL_SERVER_ERROR,
    details?: unknown,
  ) {
    // Call the parent class constructor
    super(message);

    // Ensure prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Set the prototype explicitly (for instanceof support)
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;

    // Optional: maintain stack trace (useful for logging)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
