import { Router } from 'express';
import { createUploadMiddleware } from '@/middlewares';
import {
  passwordSchema,
  deleteUserSchema,
  updateProfileSchema,
} from '@/validations/user.validation';
import { asyncHandler, secureRoute } from '@/utils';
import { getUserProfile, updateUserProfile, updatePassword, deleteUser } from '@/controllers';

// Middleware to handle profile picture upload
const avatarUpload = createUploadMiddleware('image', 'users').single;

// User routes
const router = Router();

/**
 * @route   GET /api/user/profile
 * @desc    Fetch user profile using a valid token
 * @access  Private
 */
router.get('/profile', asyncHandler(getUserProfile));

/**
 * @route   PATCH /api/user/profile
 * @desc    Update user profile (with profile picture upload)
 * @access  Private
 */
router.patch(
  '/profile',
  avatarUpload,
  ...secureRoute(updateUserProfile, { body: updateProfileSchema }),
);

/**
 * @route   PUT /password
 * @desc    Updates the user's password.
 * @access  Private (JWT required)
 */
router.put('/password', ...secureRoute(updatePassword, { body: passwordSchema }));

/**
 * @route   DELETE /api/user
 * @desc    Deletes the user account and its associated files.
 * @access  Private
 */
router.delete('/', ...secureRoute(deleteUser, { body: deleteUserSchema }));
export default router;
