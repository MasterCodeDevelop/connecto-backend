import { Router, Request, Response } from 'express';
import getUserProfile from '../controllers/user/getUserProfile.controller';
import { updateUserProfile } from '../controllers/user/updateUserProfile.controller';
import { createUploadMiddleware } from '../middlewares/upload.middleware';

// Middleware to handle profile picture upload
const avatarUpload = createUploadMiddleware('image', 'users').single;

// User routes
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
 * @route   PATCH /api/user/profile
 * @desc    Update user profile (with profile picture upload)
 * @access  Private
 */
router.patch('/profile', avatarUpload, (req: Request, res: Response) => {
  updateUserProfile(req, res);
});

export default router;
