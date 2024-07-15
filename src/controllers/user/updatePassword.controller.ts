import argon2 from 'argon2';
import { Request, Response } from 'express';
import User from '../../models/User';
import { hash } from '../../utils/argon';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from '../../utils/httpStatus';
import { errorResponse, successResponse } from '../../utils/responses';
import { passwordSchema } from '../../validations/user.validation';

/**
 * Updates the user's password.
 *
 * This async function:
 * - Checks for req.auth.userID.
 * - Validates passwords using Zod.
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
export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check if the user ID is provided in the request
    const userID = req.auth?.userID;
    if (!userID) return errorResponse(res, 'User ID is missing from the request.', BAD_REQUEST);

    // Validate input using Zod schema
    const validation = passwordSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map((i) => i.message).join(', ');
      return errorResponse(res, errorMessages, BAD_REQUEST);
    }
    const { password, newPassword } = validation.data;

    // Retrieve the user's current password from the database
    const user = await User.findById(userID).select('password');
    if (!user) return errorResponse(res, 'User not found.', NOT_FOUND);

    // Verify that the provided current password matches the stored hash
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) return errorResponse(res, 'Incorrect password.', UNAUTHORIZED);

    // Hash the new password before updating it in the database
    const hashedNewPassword = await hash(newPassword);

    // Update the password in the database
    await User.findByIdAndUpdate(userID, { password: hashedNewPassword });

    // Return success response
    return successResponse(res, 'Password updated successfully.');

    // Handle errors
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating password:', error);

    // Return a generic internal server error response
    return errorResponse(res, 'An error occurred while updating the password.');
  }
};
