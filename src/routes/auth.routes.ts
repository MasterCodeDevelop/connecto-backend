import { Router, Request, Response } from 'express';
import createUser from '../controllers/auth/createUser.controller';
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
