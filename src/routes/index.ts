import { Router, Request, Response, NextFunction } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import fileRoutes from './file.routes';
import authMiddleware from '../middlewares/auth.middleware';
import urlTokenAuthMiddleware from '../middlewares/urlTokenAuth.middleware';

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
 * Example: GET /file/user/avatar/:filename?token=xxx
 */
router.use(
  '/file',
  (req: Request, res: Response, next: NextFunction) => {
    urlTokenAuthMiddleware(req, res, next);
  },
  fileRoutes,
);

// ===================== Protected Routes =====================
/**
 * Mounts private routes under /user
 * Applies authMiddleware globally to all routes
 * These routes require authentication.
 */
router.use(
  '/user',
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
  },
  userRoutes,
);

export default router;
