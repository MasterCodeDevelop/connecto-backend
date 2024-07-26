import argon2 from 'argon2';
import { Request, Response } from 'express';
import { User } from '@/models';
import { hash, successResponse } from '@/utils';
import { NotFoundError, UnauthorizedError, InternalError } from '@/errors';

/**
 * Updates the user's password.
 *
 * This async function:
 * - Checks for req.auth.userID.
 * - Retrieves the user's current password from the database.
 * - Compares the current password with the stored hash.
 * - Hashes the new password with Argon2.
 * - Updates the password in the database.
 *
 * @route   PUT /api/user/profile/password
 * @access  Private (JWT required)
 *
 * @param {Request} req - Express request.
 *   - `auth`: must include userID.
 *   - `body`: includes 'password' and 'newPassword'.
 *
 * @param {Response} res - Express response.
 *
 * @returns {Promise<Response>} A promise resolving to a response.
 *
 * @throws Caught errors return a generic error response.
 *
 */
export const updatePassword = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract user ID, current password, and new password
  const { userID } = req.auth!;
  const { password, newPassword } = req.body;

  // Retrieve the user's current password from the database
  const user = await User.findById(userID).select('password');
  if (!user) throw new NotFoundError('User not found.');

  // Verify that the provided current password matches the stored hash
  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) throw new UnauthorizedError('Incorrect password.');

  // Hash the new password before updating it in the database
  const hashedNewPassword = await hash(newPassword);
  if (!hashedNewPassword) throw new InternalError('Failed to hash new password.');

  // Update the password in the database
  await User.findByIdAndUpdate(userID, { password: hashedNewPassword });

  // Return success response
  return successResponse(res, 'Password updated successfully.');
};
