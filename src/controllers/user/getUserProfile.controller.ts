import { Request, Response } from 'express';
import User from '../../models/User';
import errorResponse from '../../utils/errorResponse';
import { OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../utils/httpStatus';

/**
 * Retrieves the authenticated user's profile information.
 *
 * @route   GET /api/user/profile
 * @access  Private (Requires JWT authentication)
 * @param req - Express request object containing `auth.userID` from JWT
 * @param res - Express response object
 * @returns User information or error response
 */
const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userID = req.auth?.userID;

    if (!userID) {
      return errorResponse(res, 'User ID is missing from token.', BAD_REQUEST);
    }

    const user = await User.findById(userID).select('name familyName profilePicture email isAdmin');

    if (!user) {
      return errorResponse(res, 'User not found.', NOT_FOUND);
    }

    return res.status(OK).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('[getUserProfile] Error retrieving user:', error);
    return errorResponse(
      res,
      'An error occurred while retrieving the user profile.',
      INTERNAL_SERVER_ERROR,
    );
  }
};

export default getUserProfile;
