import { CorsOptions } from 'cors';
import { logger } from './logger';

// Load CORS origins from environment or default to "*"
const envOrigins = process.env.CORS_ORIGINS || '*';

/**
 * Parses a comma-separated list of origins from a string.
 * Trims each origin and filters out empty entries.
 *
 * @param value - Raw origins string from environment variable
 * @returns Array of cleaned origin strings
 */
const parseOrigins = (value: string): string[] => {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

/**
 * Builds and returns a CORS configuration object.
 *
 * - Supports public mode (`*`) for development/testing.
 * - In restricted mode, checks incoming origin against a whitelist.
 *
 * CORS_ORIGINS env example:
 *   - "*" → Public mode (any origin allowed)
 *   - "https://example.com,https://app.example.com" → Restricted mode
 *
 * @returns CorsOptions - Configured CORS policy
 */
export const corsOptions = (): CorsOptions => {
  // Public mode: allow all origins (e.g., for local dev or open APIs)
  if (envOrigins === '*') {
    logger.debug('CORS: Public mode enabled (any origin allowed)');
    return {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    };
  }

  // Restricted mode: only allow origins from the whitelist
  const allowedOrigins = parseOrigins(envOrigins);
  return {
    origin: (origin, callback) => {
      // Handle non-browser tools like Postman or curl (no Origin header)
      if (!origin) {
        logger.warn('CORS: Request without origin (CLI or Postman)');
        return callback(null, true);
      }

      // Check if the request's origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Deny access and log the unauthorized origin
      logger.error(`CORS: Access denied for origin: ${origin}`);
      return callback(new Error(`CORS access denied for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable cookies or auth headers for trusted origins
  };
};
