import { z } from 'zod';

/**
 * Validation schema for creating a comment.
 *
 * This schema requires the "content" field to be a non-empty string with:
 * - A minimum length of 1 character.
 * - A maximum length of 1000 characters.
 */
export const commentSchema = z
  .object({
    content: z
      .string()
      .min(1, 'Comment cannot be empty.')
      .max(1000, 'Comment cannot exceed 1000 characters.'),
  })
  .strict();

export type CommentSchema = z.infer<typeof commentSchema>;
