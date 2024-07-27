import { Request, Response } from 'express';
import path from 'path';
import { User } from '@/models';
import { successResponse, deleteFileIfExists } from '@/utils';
import { NotFoundError, BadRequestError } from '@/errors';
import { UPLOADS_PATHS } from '@/config';

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
export const updateUserProfile = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract authenticated user ID, uploaded file (if any), and form data
  const { userID } = req.auth!;
  const newProfilePicture = req.file?.filename;
  const { name, familyName } = req.body;

  // Fetch current user
  const user = await User.findById(userID);
  if (!user) throw new NotFoundError('User not found.');

  // Check for redundant data (no actual changes)
  const isSameName = name ? name === user.name : true;
  const isSameFamilyName = familyName ? familyName === user.familyName : true;
  if (isSameName && isSameFamilyName && !newProfilePicture)
    throw new BadRequestError('No changes detected.');

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
      const absolutePath = path.join(UPLOADS_PATHS.users, currentPicture);
      await deleteFileIfExists(absolutePath);
    }

    updatedFields.profilePicture = newProfilePicture;
  }

  // Apply the update and return updated user
  const updatedUser = await User.findByIdAndUpdate(userID, updatedFields, {
    new: true,
    select: 'name familyName profilePicture email',
  });
  if (!updatedUser) throw new NotFoundError('User not found.');

  // Response with the updated user data
  return successResponse(res, { user: updatedUser }, { message: 'Profile updated successfully.' });
};
