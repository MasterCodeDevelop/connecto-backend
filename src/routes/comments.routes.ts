import { Router } from 'express';
import { commentIdSchema, commentSchema } from '@/validations';
import { secureRoute } from '@/utils';
import { fetchCommentById, updateComment, deleteComment } from '@/controllers';

const router = Router();

/**
 * This route allows a user to fetch a comment by its ID.
 *
 * @route   GET /api/comments/:id
 * @desc    Fetch a comment by its ID
 * @access  Private
 */
router.get('/:id', ...secureRoute(fetchCommentById, { params: commentIdSchema }));

/**
 * This route allows a user to update a comment.
 *
 * @route   PUT /api/comments/:id
 * @desc    Update a comment by its ID
 * @access  Private
 */
router.put('/:id', ...secureRoute(updateComment, { params: commentIdSchema, body: commentSchema }));

/**
 * This route allows a user to delete a comment.
 *
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment by its ID
 * @access  Private
 */
router.delete('/:id', ...secureRoute(deleteComment, { params: commentIdSchema }));

export default router;
