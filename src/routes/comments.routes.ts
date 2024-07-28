import { Router } from 'express';
import { validate } from '@/middlewares';
import { commentIdSchema, commentSchema } from '@/validations';
import { asyncHandler } from '@/utils';
import { fetchCommentById, updateComment } from '@/controllers';

const router = Router();

/**
 * This route allows a user to fetch a comment by its ID.
 *
 * @route   GET /api/comments/:id
 * @desc    Fetch a comment by its ID
 * @access  Private
 */
router.get('/:id', validate({ params: commentIdSchema }), asyncHandler(fetchCommentById));

router.put(
  '/:id',
  validate({ params: commentIdSchema, body: commentSchema }),
  asyncHandler(updateComment),
);

export default router;
