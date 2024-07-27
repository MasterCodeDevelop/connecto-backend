import { Router } from 'express';
import { authMiddleware, validate } from '@/middlewares';
import { authSchema } from '@/validations';

interface ApplyProtectedRouteOptions {
  allowUrlToken?: boolean;
}

/**
 * Mounts a protected route module with authentication and validation middleware.
 *
 * Automatically applies:
 * - JWT authentication via `authMiddleware`, optionally allowing token from URL
 * - Zod schema validation for `req.auth` via `validate({ auth: authSchema })`
 *
 * @param router - Express parent router
 * @param path - Route base path (e.g., "/users", "/posts")
 * @param routeModule - Sub-router to mount under the path
 * @param options - Optional configuration (e.g., allowUrlToken for media access)
 */
export const applyProtectedRoute = (
  router: Router,
  path: string,
  routeModule: Router,
  options: ApplyProtectedRouteOptions = {},
): void => {
  router.use(path, authMiddleware(options), validate({ auth: authSchema }), routeModule);
};
