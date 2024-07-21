import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import fs from 'fs';
import { BadRequestError } from '@/errors';

/**
 * Formats Zod validation errors into a clean human-readable string.
 * If only one error is present, returns its message directly;
 * otherwise, concatenates all error messages.
 *
 * @param err - The ZodError to format.
 * @returns A formatted error message string.
 */
const formatZodError = ({ errors }: ZodError): string =>
  errors.length === 1
    ? errors[0].message
    : errors.map(({ path, message }) => `${path.join('.')}: ${message}`).join('; ');

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
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // If a file was uploaded, merge it with the body data.
      if (schemas.body) {
        const rawBody = req.body ?? {};
        // Merge file into body if present
        const data = req.file ? { ...rawBody, file: req.file } : rawBody;
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

      if (schemas.auth) {
        req.auth = schemas.auth.parse(req.auth);
      }

      next();
    } catch (error) {
      // If a file was uploaded and validation fails, remove the file.
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          next(err);
        });
      }

      if (error instanceof ZodError) {
        const message = formatZodError(error);
        return next(new BadRequestError(message));
      }
      return next(error);
    }
  };
};
