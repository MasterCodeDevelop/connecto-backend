import { Router, Request, Response } from 'express';
import createUser from '../controllers/auth/createUser.controller';
import loginUser from '../controllers/auth/loginUser.controller';

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
