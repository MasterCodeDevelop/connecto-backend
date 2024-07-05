/**
 * HTTP status codes commonly used for API responses.
 * These constants improve readability and maintainability of response code usage.
 */

// --- Success Codes ---
export const OK = 200; // Standard success
export const CREATED = 201; // Resource successfully created

// --- Client Error Codes ---
export const BAD_REQUEST = 400; // Invalid request (syntax/validation)
export const UNAUTHORIZED = 401; // Auth required or invalid credentials
export const FORBIDDEN = 403; // Authenticated but forbidden
export const NOT_FOUND = 404; // Resource not found
export const CONFLICT = 409; // Conflict (e.g., duplicate resource)

// --- Server Error Codes ---
export const INTERNAL_SERVER_ERROR = 500; // General server failure

// --- Optional: Export all as grouped object (for flexibility)
export const HttpStatus = {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} as const;

/**
 * Type union of allowed HTTP status codes.
 * Useful for validating custom response handlers.
 */
export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
