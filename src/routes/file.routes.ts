import { Router } from 'express';
import { asyncHandler } from '@/utils';
import { getUserAvatar, getPostFile } from '@/controllers';

const router = Router();

/**
 * Route to serve a user's profile picture (avatar) from the private storage.
 *
 * @param req - Express request object with `filename` in params and token in query
 * @param res - Express response object
 * @route   GET /file/user/avatar/:filename?token=JWT
 * @desc    Securely serves user profile pictures (avatars) via signed token in query
 * @access  Protected by token (via query string)
 */
router.get('/user/avatar/:filename', asyncHandler(getUserAvatar));

/**
 * Route to serve a post's file from the private storage.
 *
 * @param req - Express request object with `filename` in params and token in query
 * @param res - Express response object
 * @route   GET /file/post/:filename?token=JWT
 * @desc    Securely serves post files via signed token in query
 * @access  Protected by token (via query string)
 */
router.get('/post/:filename', asyncHandler(getPostFile));
export default router;
