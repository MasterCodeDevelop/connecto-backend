import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Validates that the comment ID is a valid MongoDB ObjectId.
 * Leverages Mongoose's built-in ID validation.
 */
export const id = z
  .string()
  .min(1, 'comment ID is required')
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid comment ID format',
  });

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

/**
 * Schema for validating the "id" parameter in the request.
 * Ensures that the id is a non-empty string and conforms to MongoDB's ObjectId format.
 */
export const commentIdSchema = z.object({
  id,
});

export type CommentSchema = z.infer<typeof commentSchema>;
