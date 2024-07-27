import { Request, Response } from 'express';
import { Comment } from '@/models';
import { successResponse } from '@/utils';

/**
 * Controller: Fetch all comments for a given post.
 *
 * Retrieves comments related to the specified post ID,
 * sorted by most recent first and including author details.
 *
 * @param req - Express request (expects req.params.id as postId)
 * @param res - Express response
 * @returns JSON response containing the list of comments
 */
export const fetchPostComments = async (req: Request, res: Response): Promise<Response> => {
  const postId = req.params.id;

  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .populate('author', 'name familyName profilePicture');

  return successResponse(res, { comments });
};
