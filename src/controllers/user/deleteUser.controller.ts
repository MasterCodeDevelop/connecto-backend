import { verify } from 'argon2';
import { Request, Response } from 'express';
import path from 'path';
import User from '@/models/User';
import { successResponse, deleteFileIfExists } from '@/utils';
import { AuthError, NotFoundError, UnauthorizedError } from '@/errors';

/**
 * Directory for avatar uploads.
 * Configurable via the UPLOADS_BASE_PATH environment variable, defaulting to 'private/uploads/users'.
 */
const AVATAR_UPLOADS_DIR = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
  'users',
);

/**
 * Deletes the user account and its associated files.
 *
 * @param req - Express Request with authentication and user data.
 * @param res - Express Response to send back the result.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response.
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  // Extract password.
  const { password } = req.body;

  // Ensure authentication
  const userID = req.auth?.userID;
  if (!userID) throw new AuthError();

  // Retrieve the user along with the password and profile picture fields.
  const user = await User.findById(userID).select('password profilePicture');
  if (!user) throw new NotFoundError('User not found.');

  // Verify that the provided password matches the stored hash.
  const valid = await verify(user.password, password);
  if (!valid) throw new UnauthorizedError('Incorrect password.');

  // Delete the profile picture if it is not the default avatar.
  if (user.profilePicture !== 'avatar.png') {
    const filePath = path.join(AVATAR_UPLOADS_DIR, user.profilePicture as string);
    await deleteFileIfExists(filePath);
  }

  // Permanently delete the user account.
  const deletedUser = await User.findByIdAndDelete(userID);
  if (!deletedUser) throw new NotFoundError('User not found or already deleted.');

  // Return a success response.
  return successResponse(res, 'Your account has been deleted.');
};
