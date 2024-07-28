import { Request, Response } from 'express';
import { Comment } from '@/models/Comment';
import { successResponse } from '@/utils';
import { NotFoundError } from '@/errors';

/**
 * Controller: Fetch a single comment by its ID, including author details.
 *
 * @route GET /comments/:id
 * @access Protected
 *
 * @param req - Express request object (expects `req.params.id`)
 * @param res - Express response object
 * @returns JSON response containing the comment data or a 404 error
 */
export const fetchCommentById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const comment = await Comment.findById(id).populate('author', 'name familyName profilePicture');
  if (!comment) throw new NotFoundError('Comment not found.');

  return successResponse(res, { comment });
};
