import { Request, Response } from 'express';
import argon2 from 'argon2';
import User from '../../models/User';
import generateToken, { TokenGenerationError } from '../../utils/jwt';
import { errorResponse, successResponse } from '../../utils/responses';
import { NOT_FOUND, UNAUTHORIZED } from '../../utils/httpStatus';

/**
 * Controller responsible for authenticating a user and returning a JWT token.
 *
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
    const { email, password } = req.body;

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

      return successResponse(res, 'Login successful.', { token });
    } catch (err) {
      if (err instanceof TokenGenerationError) {
        return errorResponse(res, 'Failed to generate token.');
      }

      console.error('[loginUser] Unexpected token generation error:', err);
      return errorResponse(res, 'An unexpected error occurred during login.');
    }
  } catch (err) {
    console.error('[loginUser] Login error:', err);
    return errorResponse(res, 'An error occurred during login.');
  }
};

export default loginUser;
