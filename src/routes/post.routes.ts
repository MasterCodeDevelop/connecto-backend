import { Router } from 'express';
import { createUploadMiddleware, validate } from '@/middlewares';
import { postIdSchema, postSchema, updatePostSchema } from '@/validations/post.validation';
import { asyncHandler } from '@/utils';
import { createPost, fetchAllPosts, fetchPostById, likePost, updatePost } from '@/controllers';

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
router.post('/', filePost, validate({ body: postSchema }), asyncHandler(createPost));

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
router.get('/:id', validate({ params: postIdSchema }), asyncHandler(fetchPostById));

/**
 * This route allows a user to like or unlike a post.
 *
 * @route   PATCH /api/post/:id/like
 * @desc    Like or unlike a post.
 * @access  Private
 */
router.patch('/:id/like', validate({ params: postIdSchema }), asyncHandler(likePost));

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
  validate({ params: postIdSchema, body: updatePostSchema }),
  asyncHandler(updatePost),
);

export default router;
