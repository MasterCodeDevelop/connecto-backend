import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { Post, Comment } from '@/models';
import { NotFoundError, UnauthorizedError } from '@/errors';
import { UPLOADS_PATHS } from '@/config';
import { successResponse } from '@/utils';

/**
 * Controller: Delete a post and its associated uploaded file (if any).
 *
 * Validates that the post exists, confirms that the authenticated user is the author,
 * deletes the associated file from the filesystem (if present),
 * then deletes the post from the database.
 *
 * @param req - Express request (requires req.params.id and req.auth.userID)
 * @param res - Express response
 * @returns Success response or throws appropriate error
 */
export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { userID } = req.auth!;

  // Retrieve the post by ID
  const post = await Post.findById(id);
  if (!post) {
    throw new NotFoundError('Post not found.');
  }

  // Ensure the authenticated user is the post author
  if (!post.author._id.equals(userID)) {
    throw new UnauthorizedError('You are not authorized to delete this post.');
  }

  // If a file is associated, attempt to delete it from disk
  if (post.file) {
    const filePath = path.join(UPLOADS_PATHS.posts, post.file);
    await fs.unlink(filePath);
  }

  // Delete all comments associated with the post, if any.
  if (post.comments.length > 0) {
    await Comment.deleteMany({ _id: { $in: post.comments } });
  }

  // Remove the post from the database
  await post.deleteOne();

  return successResponse(res, { message: 'Post deleted successfully.' });
};
