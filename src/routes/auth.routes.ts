import { Router, Request, Response, NextFunction } from 'express';
import createUser from '../controllers/auth/createUser.controller';
import loginUser from '../controllers/auth/loginUser.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// ===================== Public Routes (No Authentication Required) =====================

/**
 * @route   POST /signup
 * @desc    Create a new user account
 * @access  Public
 */
router.post('/signup', (req: Request, res: Response) => {
  createUser(req, res);
});
export default router;

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', (req: Request, res: Response) => {
  loginUser(req, res);
});

// ===================== Protected Routes (Authentication Required) =====================

/**
 * @route   GET /
 * @desc    Fetch user profile using a valid token
 * @access  Private (Requires authentication)
 */
router.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
  },
  (req: Request, res: Response) => {
    res.json({
      error: false,
      message: 'Test successfully.',
    });
  },
);
