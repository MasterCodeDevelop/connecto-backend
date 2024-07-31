import { RequestHandler, Request, Response, NextFunction } from 'express';
import { validate } from '@/middlewares';
import { ZodSchema } from 'zod';

/* eslint-disable no-unused-vars */

/**
 * Wraps an async controller to automatically catch and forward errors.
 *
 * This utility ensures that any error thrown inside an async route handler
 * is passed to the global Express error handler (via next).
 *
 * @param fn - The async route handler (controller)
 * @returns Express middleware compatible with RequestHandler
 *
 * @example
 * router.get('/user', asyncHandler(async (req, res) => {
 *   const user = await User.findById(req.params.id);
 *   res.json(user);
 * }));
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Helper to combine validation and async error handling into a single middleware chain.
 *
 * @param handler - The async controller function
 * @param schemas - Optional Zod schemas for validating request parts
 * @returns An array of middlewares to apply on the route
 */
export const secureRoute = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  schemas?: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
    headers?: ZodSchema;
    auth?: ZodSchema;
  },
): RequestHandler[] => {
  const middlewares: RequestHandler[] = [];

  if (schemas) {
    middlewares.push(validate(schemas));
  }

  middlewares.push(asyncHandler(handler));

  return middlewares;
};
