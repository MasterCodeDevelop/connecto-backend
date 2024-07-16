import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/responses';
import { BAD_REQUEST } from '../utils/httpStatus';

/**
 * Middleware to validate either req.body (default) a Zod schema.
 *
 * @param schema - Zod schema to validate.
 * @returns Express middleware.
 */
const validate = (schema: ZodSchema): RequestHandler => {
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

      // Handle Zod validation errors
    } catch (err) {
      // Check if the error is a ZodError
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => e.message);
        errorResponse(res, 'Validation failed.', BAD_REQUEST, messages);
        return;
      }

      // Handle other errors
      errorResponse(res, 'Invalid request.', BAD_REQUEST, err);
      return;
    }
  };
};

export default validate;
