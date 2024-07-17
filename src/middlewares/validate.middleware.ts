import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware to validate either req.body (default) a Zod schema.
 *
 * @param schema - Zod schema to validate.
 * @returns Express middleware.
 */
export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse the request body and file
      const parsed = req.file
        ? {
            ...req.body,
            file: req.file,
          }
        : req.body;

      // Validate the parsed data
      schema.parse(parsed);

      // Pass the request to the next middleware
      next();

      // Handle errors
    } catch (error) {
      next(error);
    }
  };
};
