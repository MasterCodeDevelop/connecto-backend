import { Router, Request, Response } from 'express';
import { createPost } from '../controllers/posts/createPost.controller';
import { createUploadMiddleware } from '../middlewares/upload.middleware';
import { fetchAllPosts } from '../controllers/posts/fetchAllPosts.controller';

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

export default router;
