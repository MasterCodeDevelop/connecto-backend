import { Router, Request, Response } from 'express';
import createUser from '../controllers/auth/createUser.controller';
import loginUser from '../controllers/auth/loginUser.controller';

const router = Router();

/**
 * @route   POST /signup
 * @desc    Create a new user account
 * @access  Public
 */
router.post('/signup', async (req: Request, res: Response) => {
  await createUser(req, res);
});

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

export default router;
