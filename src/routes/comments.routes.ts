import { Router } from 'express';
import { validate } from '@/middlewares';
import { commentIdSchema } from '@/validations';
import { asyncHandler } from '@/utils';
import { fetchCommentById } from '@/controllers';

const router = Router();

/**
 * This route allows a user to fetch a comment by its ID.
 *
 * @route   GET /api/comments/:id
 * @desc    Fetch a comment by its ID
 * @access  Private
 */
router.get('/:id', validate({ params: commentIdSchema }), asyncHandler(fetchCommentById));

export default router;
