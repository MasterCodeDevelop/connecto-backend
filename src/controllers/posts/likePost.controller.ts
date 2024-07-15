import { Request, Response } from 'express';
import Post from '../../models/Post';
import { errorResponse, successResponse } from '../../utils/responses';
import { Types } from 'mongoose';

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
export const likePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract & validate post ID
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required.' });
    }

    // Extract & validate user ID
    const userId: string | undefined = req.auth?.userID;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID is required.' });
    }

    // Query the database for the post using its ID.
    // Populate the "author" field with "name" and "familyName" from the User model.
    const post = await Post.findById(postId).populate('author', 'name familyName profilePicture');
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const userIndex = post.likes.findIndex((id) => id.toString() === userId.toString());

    if (userIndex === -1) {
      // User hasn't liked the post -> Add like
      post.likes.push(new Types.ObjectId(userId));
    } else {
      // User has already liked the post -> Remove like
      post.likes.splice(userIndex, 1);
    }

    // Save updated post
    await post.save();

    // Determine the action performed (liked or unliked).
    const action = userIndex === -1 ? 'liked' : 'unliked';

    // Return the updated post
    return successResponse(res, `Post ${action} successfully.`, post);

    // Log and return any errors that occur during the process
  } catch (error) {
    console.error('Error liking post:', error);
    return errorResponse(res, 'An error occurred while liking the post.');
  }
};
