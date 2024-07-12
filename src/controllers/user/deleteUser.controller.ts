import { verify } from 'argon2';
import { Request, Response } from 'express';
import path from 'path';
import User from '../../models/User';
import { FORBIDDEN, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from '../../utils/httpStatus';
import { errorResponse, successResponse } from '../../utils/responses';
import { loginSchema } from '../../validations/user.validation';
import { deleteFileIfExists } from '../../utils/files';

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
  try {
    // Verify if the user is authenticated.
    if (!req.auth || !req.auth.userID) {
      return errorResponse(res, 'Unauthorized access.', FORBIDDEN);
    }
    const userID = req.auth.userID;

    // Extract and validate the provided password.
    const { password } = req.body;
    const passwordSchema = loginSchema.shape.password;
    const validationPassword = passwordSchema.safeParse(password);
    if (!validationPassword.success) {
      return errorResponse(res, 'Password is required.', BAD_REQUEST);
    }

    // Retrieve the user along with the password and profile picture fields.
    const user = await User.findById(userID).select('password profilePicture');
    if (!user) {
      return errorResponse(res, 'This user does not exist.', NOT_FOUND);
    }

    // Verify that the provided password matches the stored hash.
    const valid = await verify(user.password, password);
    if (!valid) {
      return errorResponse(res, 'Incorrect password.', UNAUTHORIZED);
    }

    // Delete the profile picture if it is not the default avatar.
    if (user.profilePicture !== 'avatar.png') {
      const filePath = path.join(AVATAR_UPLOADS_DIR, user.profilePicture as string);
      await deleteFileIfExists(filePath);
    }

    // Permanently delete the user account.
    await User.findByIdAndDelete(userID);

    // Return a success response.
    return successResponse(res, 'Your account has been deleted.');

    // Catch any errors that occur during the process.
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse(res, 'An error occurred while deleting the account.');
  }
};
