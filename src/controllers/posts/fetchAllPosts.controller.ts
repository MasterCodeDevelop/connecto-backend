import { Request, Response } from 'express';
import { Post } from '@/models';
import { successResponse } from '@/utils';
import { NotFoundError } from '@/errors';

/**
 * Controller to fetch all posts from the database.
 *
 * Retrieves all posts sorted by creation date (most recent first) and populates
 * the "author" field with the user's name, familyName, and profilePicture.
 * Returns a JSON response containing the list of posts or an error message.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns {Promise<Response>} A promise resolving to a JSON response.
 */
export const fetchAllPosts = async (req: Request, res: Response): Promise<Response | void> => {
  // Find all posts sorted by creation date (most recent first) and populate the "author" field.
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name familyName profilePicture')
    .lean();

  // Throw an error if no posts are found.
  if (!posts) throw new NotFoundError('No posts found.');

  // Return a successful response with the list of posts.
  return successResponse(res, { posts });
};
