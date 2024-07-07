import { Request, Response } from 'express';
import argon2 from 'argon2';
import User from '../../models/User';
import generateToken, { TokenGenerationError } from '../../utils/jwt';
import errorResponse from '../../utils/errorResponse';
import {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  OK,
  INTERNAL_SERVER_ERROR,
} from '../../utils/httpStatus';
import { loginSchema } from '../../validations/user.validation';

/**
 * Controller responsible for authenticating a user and returning a JWT token.
 *
 * - Validate user credentials with Zod
 * - Find user by email in the database
 * - Compare hashed password using Argon2
 * - Generate JWT token on successful login
 *
 * @route   POST /api/auth/login
 * @param req - Express Request containing email and password
 * @param res - Express Response used to send result
 * @returns Express Response with token or error
 */
const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return errorResponse(res, 'Validation failed.', BAD_REQUEST, validation.error.flatten());
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'User with this email does not exist.', NOT_FOUND);
    }

    // Compare hashed passwords
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Incorrect password.', UNAUTHORIZED);
    }

    // Generate JWT token
    try {
      const tokenPayload = { userID: user._id, isAdmin: user.isAdmin };
      const token = await generateToken(tokenPayload);

      return res.status(OK).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
        },
      });
    } catch (err) {
      if (err instanceof TokenGenerationError) {
        return errorResponse(res, 'Failed to generate token.', INTERNAL_SERVER_ERROR);
      }

      console.error('[loginUser] Unexpected token generation error:', err);
      return errorResponse(
        res,
        'An unexpected error occurred during login.',
        INTERNAL_SERVER_ERROR,
      );
    }
  } catch (err) {
    console.error('[loginUser] Login error:', err);
    return errorResponse(res, 'An error occurred during login.', INTERNAL_SERVER_ERROR);
  }
};

export default loginUser;
