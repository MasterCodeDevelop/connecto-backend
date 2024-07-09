import { Request, Response } from 'express';
import path from 'path';
import User from '../../models/User';
import { errorResponse, successResponse } from '../../utils/responses';
import { BAD_REQUEST, NOT_FOUND, FORBIDDEN } from '../../utils/httpStatus';
import { updateProfileSchema } from '../../validations/user.validation';
import { deleteFileIfExists } from '../../utils/files';

/**
 * Base upload directory, configurable via .env or defaults to `private/uploads`
 */
const filePath = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
  'users',
);

/**
 * Updates the authenticated user's profile (name and/or familyName).
 * Prevents update if new values are identical to the current ones.
 *
 * @route   PATCH /api/user/profile
 * @access  Private (Requires JWT authentication)
 * @param req - Express request object containing `auth.userID` from JWT
 * @param res - Express response object
 * @returns Updated user info or error
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userID = req.auth?.userID;
    const newProfilePicture = req.file ? req.file.filename : undefined;

    //Ensure authenticated user
    if (!userID) {
      return errorResponse(res, 'Unauthorized access.', FORBIDDEN);
    }

    // Validate input fields with Zod
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success && !newProfilePicture) {
      return errorResponse(res, 'Validation failed.', BAD_REQUEST, validation.error.flatten());
    }
    const { name, familyName } = validation.success ? validation.data : {};

    // Fetch current user
    const user = await User.findById(userID);
    if (!user) {
      return errorResponse(res, 'User not found.', NOT_FOUND);
    }

    // Check for redundant data (no actual changes)
    const isSameName = name ? name === user.name : true;
    const isSameFamilyName = familyName ? familyName === user.familyName : true;

    if (isSameName && isSameFamilyName && !newProfilePicture) {
      return errorResponse(
        res,
        'Provided values are identical to existing profile data.',
        BAD_REQUEST,
      );
    }

    // Prepare updated fields
    const updatedFields: Partial<{
      name: string;
      familyName: string;
      profilePicture?: string;
    }> = {};
    if (name && !isSameName) updatedFields.name = name;
    if (familyName && !isSameFamilyName) updatedFields.familyName = familyName;

    // Update profile picture
    if (newProfilePicture) {
      const currentPicture = user.profilePicture;

      const isCustomPicture =
        currentPicture && typeof currentPicture === 'string' && currentPicture !== 'avatar.png';

      if (isCustomPicture) {
        const absolutePath = path.join(filePath, currentPicture);
        await deleteFileIfExists(absolutePath);
      }

      updatedFields.profilePicture = newProfilePicture;
    }

    // Apply the update and return updated user
    const updatedUser = await User.findByIdAndUpdate(userID, updatedFields, {
      new: true,
      select: 'name familyName profilePicture email',
    });

    // Response with the updated user data
    return successResponse(res, 'User profile updated successfully.', { user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse(res, 'An unexpected error occurred while updating the profile.');
  }
};
