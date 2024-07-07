import { Router, Request, Response } from 'express';
import getUserProfile from '../controllers/user/getUserProfile.controller';
const router = Router();
/**
 * @route   GET /api/user/profile
 * @desc    Fetch user profile using a valid token
 * @access  Private
 */
router.get('/profile', (req: Request, res: Response) => {
  getUserProfile(req, res);
});

export default router;
