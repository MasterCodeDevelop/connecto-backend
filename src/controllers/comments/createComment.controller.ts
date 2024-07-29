import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Comment, Post } from '@/models';
import { successResponse } from '@/utils';
import { NotFoundError } from '@/errors';
/**
 * Controller to create a new comment on a post.
 *
 * Preconditions:
 * - `req.auth.userID`, `req.params.id`, and `req.body.content` are validated via Zod middleware.
 *
 * This handler:
 * - Verifies that the target post exists
 * - Creates and saves a comment associated with the post and author
 * - Pushes the comment ID into the post's `comments` array
 * - Returns the populated comment (with author details) in the response
 * *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns {Promise<Response>} - JSON response with the created comment
 */
export const createComment = async (req: Request, res: Response): Promise<Response | void> => {
  // Extract userID, post ID and comment content
  const { userID } = req.auth!;
  const postID = req.params.id;
  const { content } = req.body;

  // Ensure the target post exists
  const post = await Post.findById(postID);
  if (!post) throw new NotFoundError('Post not found.');

  // Create and save the comment instance
  const newComment = new Comment({
    content,
    author: userID,
    postId: postID,
  });
  await newComment.save();

  // Update the post's comments list with the new comment ID.
  post.comments.push(newComment._id as mongoose.Types.ObjectId);
  await post.save();

  // Populate author fields for the response
  const comment = await Comment.findById(newComment._id).populate(
    'author',
    'name familyName profilePicture',
  );

  // Return the populated comment with a successful status code.
  return successResponse(
    res,
    { comment },
    { message: 'Comment created successfully.', status: 201 },
  );
};
