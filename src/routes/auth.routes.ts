import { Router } from 'express';
import { registerSchema, loginSchema } from '@/validations/user.validation';
import { secureRoute } from '@/utils';
import { createUser, loginUser } from '@/controllers';

const router = Router();

/**
 * @route   POST /signup
 * @desc    Create a new user account
 * @access  Public
 */
router.post('/signup', ...secureRoute(createUser, { body: registerSchema }));

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', ...secureRoute(loginUser, { body: loginSchema }));

export default router;
