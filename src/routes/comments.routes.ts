import { Router } from 'express';
import { validate } from '@/middlewares';
import { commentIdSchema, commentSchema } from '@/validations';
import { asyncHandler } from '@/utils';
import { fetchCommentById, updateComment, deleteComment } from '@/controllers';

const router = Router();

/**
 * This route allows a user to fetch a comment by its ID.
 *
 * @route   GET /api/comments/:id
 * @desc    Fetch a comment by its ID
 * @access  Private
 */
router.get('/:id', validate({ params: commentIdSchema }), asyncHandler(fetchCommentById));

/**
 * This route allows a user to update a comment.
 *
 * @route   PUT /api/comments/:id
 * @desc    Update a comment by its ID
 * @access  Private
 */
router.put(
  '/:id',
  validate({ params: commentIdSchema, body: commentSchema }),
  asyncHandler(updateComment),
);

/**
 * This route allows a user to delete a comment.
 *
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment by its ID
 * @access  Private
 */
router.delete('/:id', validate({ params: commentIdSchema }), asyncHandler(deleteComment));

export default router;
