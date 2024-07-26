import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, urlTokenAuthMiddleware, validate } from '@/middlewares';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import filesRoutes from './files.routes';
import postsRoutes from './posts.routes';
import { authSchema } from '@/validations/auth.validation';

const router = Router();

// ===================== Public Routes =====================
/**
 * Mounts public routes like /auth/signup and /auth/login
 * These routes do not require authentication.
 */
router.use('/auth', authRoutes);

/**
 * Secure file access via signed URLs.
 * Applies urlTokenAuthMiddleware globally to all routes
 * Example: GET /files/user/avatar/:filename?token=xxx
 */
router.use(
  '/files',
  (req: Request, res: Response, next: NextFunction) => {
    urlTokenAuthMiddleware(req, res, next);
  },
  filesRoutes,
);

// ===================== Protected Routes =====================
/**
 * Mounts private routes under /users
 * Applies authMiddleware globally to all routes
 * These routes require authentication.
 */
router.use(
  '/users',
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
  },
  validate({ auth: authSchema }),
  usersRoutes,
);

/**
 * Mounts private routes under /posts path
 * Applies authMiddleware globally to all routes
 * These routes require authentication.
 */
router.use(
  '/posts',
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
  },
  validate({ auth: authSchema }),
  postsRoutes,
);

export default router;
