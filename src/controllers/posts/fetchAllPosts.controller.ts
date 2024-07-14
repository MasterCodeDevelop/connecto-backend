import { Request, Response } from 'express';
import Post from '../../models/Post';
import { errorResponse, successResponse } from '../../utils/responses';

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
export const fetchAllPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Retrieve all posts sorted by creation date (most recent first)
    // and populate the "author" field with selected user details.
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name familyName profilePicture')
      .lean();

    // Return a successful response with the list of posts.
    return successResponse(res, 'Posts retrieved successfully.', posts);

    // Log and return any errors that occur during the process
  } catch (error) {
    console.error('Error retrieving posts:', error);
    return errorResponse(res, 'An error occurred while retrieving posts.');
  }
};
