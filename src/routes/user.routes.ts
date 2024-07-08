import { Router, Request, Response } from 'express';
import getUserProfile from '../controllers/user/getUserProfile.controller';
import { updateUserProfile } from '../controllers/user/updateUserProfile.controller';

const router = Router();
/**
 * @route   GET /api/user/profile
 * @desc    Fetch user profile using a valid token
 * @access  Private
 */
router.get('/profile', (req: Request, res: Response) => {
  getUserProfile(req, res);
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile using a valid token
 * @access  Private
 */
router.put('/profile', (req: Request, res: Response) => {
  updateUserProfile(req, res);
});
export default router;
