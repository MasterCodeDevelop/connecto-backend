import { Request, Response } from 'express';
import Post from '../../models/Post';
import { errorResponse, successResponse } from '../../utils/responses';
import { BAD_REQUEST, NOT_FOUND } from '../../utils/httpStatus';
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
export const fetchPostById = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the post ID from the URL parameters.
    const postId = req.params.id;
    if (!postId) return errorResponse(res, 'Post ID is required.', BAD_REQUEST);

    // Query the database for the post by ID and populate the "author" field.
    const post = await Post.findById(postId).populate('author', 'name familyName profilePicture');
    if (!post) return errorResponse(res, 'Post not found.', NOT_FOUND);

    // Return the post data with a successful status code.
    return successResponse(res, 'Post retrieved successfully.', { post });

    // Log and return any errors that occur during the process
  } catch (error) {
    console.error('Error retrieving post:', error);
    return errorResponse(res, 'An error occurred while retrieving the post.');
  }
};
