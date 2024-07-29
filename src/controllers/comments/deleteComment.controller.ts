import { Request, Response } from 'express';
import { Comment } from '@/models/Comment';
import { successResponse } from '@/utils';
import { NotFoundError, UnauthorizedError } from '@/errors';

/**
 * Controller: Delete a comment by its ID.
 *
 * Requirements:
 * - Only the author of the comment can delete it.
 * - `id` and `userID` are already validated via Zod middleware.
 *
 * Route: DELETE /comments/:id
 * Access: Authenticated users
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON success response or appropriate error
 */
export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params; // comment ID
  const { userID } = req.auth!;

  // Find the comment by ID
  const comment = await Comment.findById(id);
  if (!comment) throw new NotFoundError('Comment not found.');

  // Check if the current user is the author
  if (!comment.author._id.equals(userID)) {
    throw new UnauthorizedError('You are not authorized to update this comment.');
  }

  // Delete the comment.
  await comment.deleteOne();

  //
  return successResponse(res, { message: 'Comment deleted successfully.' });
};
