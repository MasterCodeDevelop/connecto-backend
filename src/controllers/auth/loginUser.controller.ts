import { Request, Response } from 'express';
import argon2 from 'argon2';
import { User } from '@/models';
import { generateToken, successResponse } from '@/utils';
import { InternalError, UnauthorizedError, NotFoundError } from '@/errors';

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
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User with this email does not exist.');

  // Compare hashed passwords
  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new UnauthorizedError('Invalid password.');

  // Generate JWT token
  const tokenPayload = { userID: user._id, isAdmin: user.isAdmin };
  const token = await generateToken(tokenPayload);
  if (!token) throw new InternalError('JWT signing failed.');

  // Return success response
  return successResponse(res, { token });
};
