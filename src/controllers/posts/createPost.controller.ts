import { Request, Response } from 'express';
import { Post, User } from '@/models';
import { successResponse } from '@/utils';
import { UnauthorizedError } from '@/errors';
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
export const createPost = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract conent, user ID, and filename
  const { content } = req.body;
  const { userID } = req.auth!;
  const file = req.file?.filename;

  // Check if the authenticated user exists
  const userExists = await User.exists({ _id: userID });
  if (!userExists) {
    throw new UnauthorizedError('Authenticated user does not exist.');
  }

  // Create a new Post instance with the validated data
  const newPost = new Post({
    content,
    author: userID,
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
  return successResponse(res, { post }, { message: 'Post created successfully.', status: 201 });
};
