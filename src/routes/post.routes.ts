import { Router, Request, Response } from 'express';
import { createPost } from '../controllers/posts/createPost.controller';
import { createUploadMiddleware } from '../middlewares/upload.middleware';

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

export default router;
