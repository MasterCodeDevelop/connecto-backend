import { z } from 'zod';
import { objectId, content } from './utils';

/**
 * Payload for creating or updating a comment.
 */
export const commentSchema = z
  .object({
    content: content('Comment content'),
  })
  .strict();

export type CommentCreateDTO = z.infer<typeof commentSchema>;

/**
 * Route parameter schema for comment ID.
 */
export const commentIdSchema = z
  .object({
    id: objectId('Comment ID'),
  })
  .strict();

export type CommentId = z.infer<typeof commentIdSchema>;
