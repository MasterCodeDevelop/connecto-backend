import { z } from 'zod';

// Define the validation for the "content" field.
const contentField = z
  .string({
    required_error: 'Content is required.',
  })
  .min(10, 'Content must be at least 10 characters long.')
  .max(5000, 'Content cannot exceed 5000 characters.');

// Define the post schema with a strict object shape that includes the "content" field.
export const postSchema = z
  .object({
    content: contentField,
  })
  .strict();
