import { Router } from 'express';
import { validate } from '@/middlewares';
import { registerSchema, loginSchema } from '@/validations/user.validation';
import { asyncHandler } from '@/utils';
import { createUser, loginUser } from '@/controllers';

const router = Router();

/**
 * @route   POST /signup
 * @desc    Create a new user account
 * @access  Public
 */
router.post('/signup', validate({ body: registerSchema }), asyncHandler(createUser));

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', validate({ body: loginSchema }), asyncHandler(loginUser));

export default router;
