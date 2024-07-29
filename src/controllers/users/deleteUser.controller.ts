import { verify } from 'argon2';
import { Request, Response } from 'express';
import path from 'path';
import { User, Post, Comment } from '@/models';
import { successResponse, deleteFileIfExists } from '@/utils';
import { NotFoundError, UnauthorizedError } from '@/errors';
import { UPLOADS_PATHS } from '@/config';

/**
 * Deletes the user account and its associated files.
 *
 * @param req - Express Request with authentication and user data.
 * @param res - Express Response to send back the result.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response.
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  // Extract userID and password.
  const { userID } = req.auth!;
  const { password } = req.body;

  // Retrieve the user along with the password and profile picture fields.
  const user = await User.findById(userID).select('password profilePicture');
  if (!user) throw new NotFoundError('User not found.');

  // Verify that the provided password matches the stored hash.
  const valid = await verify(user.password, password);
  if (!valid) throw new UnauthorizedError('Incorrect password.');

  // Delete the profile picture if it is not the default avatar.
  if (user.profilePicture !== 'avatar.png') {
    const filePath = path.join(UPLOADS_PATHS.users, user.profilePicture as string);
    await deleteFileIfExists(filePath);
  }

  // Fetch all posts by the user
  const posts = await Post.find({ author: userID });
  // Delete all associated files
  for (const post of posts) {
    const { comments, file } = post;

    // Delete all comments associated with the post, if any.
    if (comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: comments } });
    }
    // Delete the file associated with the post, if any
    if (file) {
      const filePath = path.join(UPLOADS_PATHS.posts, file as string);
      await deleteFileIfExists(filePath);
    }
    // Delete the post
    await post.deleteOne();
  }

  // Permanently delete the user account.
  const deletedUser = await User.findByIdAndDelete(userID);
  if (!deletedUser) throw new NotFoundError('User not found or already deleted.');

  // Return a success response.
  return successResponse(res, { message: 'Your account has been deleted.' });
};
