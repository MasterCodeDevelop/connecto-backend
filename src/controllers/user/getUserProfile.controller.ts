import { Request, Response } from 'express';
import User from '@/models/User';
import { successResponse } from '@/utils';
import { NotFoundError, AuthError } from '@/errors';

/**
 * Retrieves the authenticated user's profile information.
 *
 * @route   GET /api/user/profile
 * @access  Private (Requires JWT authentication)
 * @param req - Express request object containing `auth.userID` from JWT
 * @param res - Express response object
 * @returns User information or error response
 */
export const getUserProfile = async (req: Request, res: Response): Promise<Response | void> => {
  // Ensure authentication
  const userID = req.auth?.userID;
  if (!userID) throw new AuthError();

  // Find the user by ID
  const user = await User.findById(userID).select('name familyName profilePicture email isAdmin');
  if (!user) throw new NotFoundError('User not found.');

  // Return the user information
  return successResponse(res, 'User profile retrieved successfully.', { user });
};
