import { Request, Response } from 'express';
import { Post } from '@/models';
import { successResponse } from '@/utils';
import { NotFoundError } from '@/errors';

/**
 * Controller to fetch a post by its ID.
 *
 * Retrieves a post from the database using the ID provided in the URL parameters.
 * Populates the "author" field with the user's name, familyName, and profilePicture.
 * Returns a JSON response with the post data or an error message.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns {Promise<Response>} A promise resolving to a JSON response.
 */
export const fetchPostById = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract post ID
  const { id } = req.params;

  // Query the database for the post by ID and populate the "author" field.
  const post = await Post.findById(id).populate('author', 'name familyName profilePicture');
  if (!post) throw new NotFoundError('Post not found.');

  // Return the post data with a successful status code.
  return successResponse(res, { post });
};
