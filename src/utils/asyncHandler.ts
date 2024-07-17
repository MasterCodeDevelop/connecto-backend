import { Request, Response, NextFunction, RequestHandler } from 'express';

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
export const asyncHandler = (
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
