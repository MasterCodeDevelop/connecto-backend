import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Post from '@/models/Post';
import { successResponse } from '@/utils';
import { BadRequestError, AuthError, NotFoundError } from '@/errors';

/**
 * Controller to like or unlike a post.
 *
 * @route   PATCH /api/post/:id/like
 * @desc    Like or unlike a post.
 * @access  Private
 * @param req - Express Request object (expects req.params.id for post ID and req.auth.userID for user ID)
 * @param res - Express Response object
 * @returns {Promise<Response>} - Returns the updated post or an error response
 */
export const likePost = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract & validate post ID
  const postID = req.params.id;
  if (!postID) throw new BadRequestError('Post ID is required.');

  // Extract & validate user ID
  const userID = req.auth?.userID;
  if (!userID) throw new AuthError();

  // Query the database for the post by ID and populate the "author" field.
  const post = await Post.findById(postID).populate('author', 'name familyName profilePicture');
  if (!post) throw new NotFoundError('Post not found.');

  // User's like/unlike logic
  const userIndex = post.likes.findIndex((id) => id.toString() === userID.toString());
  if (userIndex === -1) post.likes.push(new Types.ObjectId(userID));
  else post.likes.splice(userIndex, 1);

  // Save updated post
  await post.save();

  // Determine the action performed (liked or unliked).
  const action = userIndex === -1 ? 'liked' : 'unliked';

  // Return the updated post
  return successResponse(res, `Post ${action} successfully.`, { post });
};
