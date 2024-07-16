import { Router, Request, Response } from 'express';
import { createUploadMiddleware } from '../middlewares/upload.middleware';
import validate from '../middlewares/validate.middleware';
import {
  passwordSchema,
  deleteUserSchema,
  updateProfileSchema,
} from '../validations/user.validation';
import { getUserProfile } from '../controllers/user/getUserProfile.controller';
import { updateUserProfile } from '../controllers/user/updateUserProfile.controller';
import { updatePassword } from '../controllers/user/updatePassword.controller';
import { deleteUser } from '../controllers/user/deleteUser.controller';

// Middleware to handle profile picture upload
const avatarUpload = createUploadMiddleware('image', 'users').single;

// User routes
const router = Router();

/**
 * @route   GET /api/user/profile
 * @desc    Fetch user profile using a valid token
 * @access  Private
 */
router.get('/profile', async (req: Request, res: Response) => {
  await getUserProfile(req, res);
});

/**
 * @route   PATCH /api/user/profile
 * @desc    Update user profile (with profile picture upload)
 * @access  Private
 */
router.patch(
  '/profile',
  avatarUpload,
  validate(updateProfileSchema),
  async (req: Request, res: Response) => {
    await updateUserProfile(req, res);
  },
);

/**
 * @route   PUT /password
 * @desc    Updates the user's password.
 * @access  Private (JWT required)
 */
router.put('/password', validate(passwordSchema), async (req: Request, res: Response) => {
  await updatePassword(req, res);
});

/**
 * @route   DELETE /api/user
 * @desc    Deletes the user account and its associated files.
 * @access  Private
 */
router.delete('/', validate(deleteUserSchema), async (req: Request, res: Response) => {
  await deleteUser(req, res);
});
export default router;
