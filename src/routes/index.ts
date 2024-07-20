import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, urlTokenAuthMiddleware, validate } from '@/middlewares';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import fileRoutes from './file.routes';
import postRoutes from './post.routes';
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
  validate({ auth: authSchema }),
  userRoutes,
);

/**
 * Mounts private routes under /post path
 * Applies authMiddleware globally to all routes
 * These routes require authentication.
 */
router.use(
  '/post',
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
  },
  validate({ auth: authSchema }),
  postRoutes,
);

export default router;
