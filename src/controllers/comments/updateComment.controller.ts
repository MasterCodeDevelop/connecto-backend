import { Request, Response } from 'express';
import { Comment } from '@/models/Comment';
import { successResponse } from '@/utils';
import { NotFoundError, UnauthorizedError } from '@/errors';

/**
 * Controller: Update an existing comment.
 *
 * Zod middleware has already validated the `params.id`, `auth.userID` and `body.content`
 *
 * Route: PUT /comments/:id
 * Access: Authenticated users (must be the author)
 *
 * @param req - Express request object with validated `params.id`, `auth.userID` and `body.content`
 * @param res - Express response object
 * @returns Updated comment data or appropriate error
 */
export const updateComment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { userID } = req.auth!;
  const { content } = req.body;

  // Find the comment by ID and populate author info
  const comment = await Comment.findById(id).populate('author', 'name familyName profilePicture');
  if (!comment) throw new NotFoundError('Comment not found.');

  // Check if the current user is the author
  if (!comment.author._id.equals(userID)) {
    throw new UnauthorizedError('You are not authorized to update this comment.');
  }

  // Update the content and save
  comment.content = content;
  await comment.save();

  return successResponse(res, { comment }, { message: 'Comment updated successfully.' });
};
