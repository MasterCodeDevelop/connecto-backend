import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Post } from '@/models';
import { NotFoundError, UnauthorizedError } from '@/errors';
import { successResponse } from '@/utils';
import { UPLOADS_PATHS } from '@/config';

/**
 * Controller for updating a post.
 *
 * This function handles optional file uploads via Multer, validates the update data,
 * verifies that the authenticated user is the post's author, deletes the old file (if applicable),
 * updates the post fields, and saves the changes to the database.
 *
 * @param req - Express Request object (expects req.params.id, req.body, and optionally req.file)
 * @param res - Express Response object
 * @returns {Promise<Response | void>} - Returns the updated post on success or an error response
 */
/**
 * Controller to update a post.
 *
 * Precondition: req.auth, req.params, req.body, and req.file are already validated using Zod.
 *
 * - Verifies that the user is the author of the post
 * - Replaces the file if a new one is uploaded
 * - Updates the content
 * - Saves the changes
 *
 * @param req - Express request object with validated fields
 * @param res - Express response object
 *@returns {Promise<Response | void>} - Returns the Updated post wrapped in a success response
 */
export const updatePost = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract userID and post ID
  const { userID } = req.auth!;
  const { id } = req.params;
  const { content } = req.body;

  // Fetch the post from DB and populate author data
  const post = await Post.findById(id).populate('author', 'name familyName profilePicture');
  if (!post) throw new NotFoundError('Post not found.');

  // Ensure that the user requesting the update is the author
  if (!post.author._id.equals(userID)) {
    throw new UnauthorizedError('You are not authorized to update this post.');
  }

  // If a new file was uploaded, delete the old one (if it exists), then update the file reference
  if (req.file && req.file.filename) {
    if (post.file) {
      const oldFilePath = path.join(UPLOADS_PATHS.posts, post.file);
      await fs.unlink(oldFilePath);
    }
    post.file = req.file?.filename;
  }

  // Update the content if provided
  if (content) post.content = content;

  // Save the updated post to the database
  await post.save();

  return successResponse(res, 'Post updated successfully.', { post });
};
