import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '@/errors';

/**
 * Middleware to validate specific parts of the request using Zod schemas.
 *
 * @param schemas - Object specifying Zod schemas for request sections: body, query, params, headers, auth.
 * @returns Express middleware with full Zod validation and error handling.
 */
export const validate = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
  auth?: ZodSchema;
}): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate and override request parts only if schema exists
      if (schemas.body) {
        const data = req.file ? { ...req.body, file: req.file } : req.body;
        req.body = schemas.body.parse(data);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.headers) {
        req.headers = schemas.headers.parse(req.headers);
      }

      if (schemas.auth && req.auth) req.auth = schemas.auth.parse(req.auth);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Generate a user-friendly error message
        const message = error.errors
          .map(({ path, message }) => `${path.join('.')}: ${message}`)
          .join('; ');

        // Throw a custom error to be caught by global error handler
        return next(new BadRequestError(message));
      }

      // Pass non-Zod errors to the default handler
      return next(error);
    }
  };
};
