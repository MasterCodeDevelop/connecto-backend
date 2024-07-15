import { Router, Request, Response } from 'express';
import { createPost } from '../controllers/posts/createPost.controller';
import { createUploadMiddleware } from '../middlewares/upload.middleware';
import { fetchAllPosts } from '../controllers/posts/fetchAllPosts.controller';
import { fetchPostById } from '../controllers/posts/fetchPostById.controller';
import { likePost } from '../controllers/posts/likePost.controller';

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
router.post('/', filePost, async (req: Request, res: Response) => {
  await createPost(req, res);
});

/**
 * This route fetches all posts from the database.
 *
 * @route   GET /api/post
 * @desc    Fetch all posts from the database.
 * @access  Private
 */
router.get('/', async (req: Request, res: Response) => {
  await fetchAllPosts(req, res);
});

/**
 * This route fetches a specific post by its ID.
 *
 * @route   GET /api/post/:id
 * @desc    Fetch a specific post by its ID.
 * @access  Private
 */
router.get('/:id', async (req: Request, res: Response) => {
  await fetchPostById(req, res);
});

/**
 * This route allows a user to like or unlike a post.
 *
 * @route   PATCH /api/post/:id/like
 * @desc    Like or unlike a post.
 * @access  Private
 */
router.patch('/:id/like', async (req: Request, res: Response) => {
  likePost(req, res);
});

export default router;
