import { Router } from 'express';
import { createUploadMiddleware } from '@/middlewares';
import { postIdSchema, postSchema, updatePostSchema, commentSchema } from '@/validations';
import { secureRoute, asyncHandler } from '@/utils';
import {
  createPost,
  fetchAllPosts,
  fetchPostById,
  likePost,
  updatePost,
  deletePost,
  createComment,
  fetchPostComments,
} from '@/controllers';

// Create middleware for handling file uploads.
const filePost = createUploadMiddleware('image', 'posts').single;

// Initialize the Express router.
const router = Router();

/**
 * This route handles the creation of a new post.
 *
 * @route   POST /api/post
 * @desc    Create a new Post with an optional image file.
 * @access  Private
 */
router.post('/', filePost, ...secureRoute(createPost, { body: postSchema }));

/**
 * This route fetches all posts from the database.
 *
 * @route   GET /api/post
 * @desc    Fetch all posts from the database.
 * @access  Private
 */
router.get('/', asyncHandler(fetchAllPosts));

/**
 * This route fetches a specific post by its ID.
 *
 * @route   GET /api/post/:id
 * @desc    Fetch a specific post by its ID.
 * @access  Private
 */
router.get('/:id', ...secureRoute(fetchPostById, { params: postIdSchema }));

/**
 * This route allows a user to like or unlike a post.
 *
 * @route   PATCH /api/post/:id/like
 * @desc    Like or unlike a post.
 * @access  Private
 */
router.patch('/:id/like', ...secureRoute(likePost, { params: postIdSchema }));

/**
 * This route allows a user to update a post.
 *
 * @route   PATCH /api/post/:id
 * @desc    Update a post with an optional image file.
 * @access  Private
 */
router.patch(
  '/:id',
  filePost,
  ...secureRoute(updatePost, { params: postIdSchema, body: updatePostSchema }),
);

/**
 * This route allows a user to delete a post.
 *
 * @route   DELETE /api/post/:id
 * @desc    Delete a post by its ID.
 * @access  Private
 */
router.delete('/:id', ...secureRoute(deletePost, { params: postIdSchema }));

/**
 * This route handles the creation of a new comment
 *
 * @route   POST /api/post/comments
 * @desc    Create a new Comment
 * @access  Private
 */
router.post(
  '/:id/comments',
  ...secureRoute(createComment, { params: postIdSchema, body: commentSchema }),
);

/**
 * This route fetches all comments for a given post.
 *
 * @route   GET /api/post/:id/comments
 * @desc    Fetch all comments for a given post.
 * @access  Private
 */
router.get('/:id/comments', ...secureRoute(fetchPostComments, { params: postIdSchema }));

export default router;
