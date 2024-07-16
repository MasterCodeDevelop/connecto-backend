import { Request, Response } from 'express';
import Post from '../../models/Post';
import { errorResponse, successResponse } from '../../utils/responses';
import { UNAUTHORIZED } from '../../utils/httpStatus';
/**
 * Controller to create a new post with an image upload.
 *
 * This function uses Multer to handle file uploads, checks user authentication, and then creates and saves
 * a new post in the database.
 *
 * @param req - Express Request object (expects req.auth.userID from auth middleware)
 * @param res - Express Response object
 * @returns {Promise<Response>} - Returns the created post or an error response
 */
export const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { content } = req.body;

    // Ensure the user is authenticated.
    const author = req.auth?.userID;
    if (!author) return errorResponse(res, 'User not authenticated.', UNAUTHORIZED);

    // Get the filename of the uploaded file
    const file = req.file?.filename;

    // Create a new Post instance with the validated data
    const newPost = new Post({
      content,
      author,
      file,
    });

    // Save the new post to the database
    await newPost.save();

    // Retrieve the post from the database and populate the "author" field with selected user details.
    const post = await Post.findById(newPost._id).populate(
      'author',
      'name familyName profilePicture',
    );

    // Return a success response with the created post.
    return successResponse(res, 'Post created successfully.', { post });

    // Log and return any errors that occur during post creation
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
};
