import mongoose from 'mongoose';
import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                Field Validators                            */
/* -------------------------------------------------------------------------- */

/**
 * Validates that the content is a non-empty string between 10 and 5000 characters.
 */
const content = z
  .string({
    required_error: 'Content is required.',
  })
  .min(10, 'Content must be at least 10 characters long.')
  .max(5000, 'Content cannot exceed 5000 characters.');

/**
 * Validates that the file name is a non-empty string.
 */
const fileName = z.string().min(1, 'File name is required');

/**
 * Validates the file's MIME type.
 * Only JPEG and PNG formats are accepted.
 */
const fileMimeType = z.string().refine((type) => ['image/jpeg', 'image/png'].includes(type), {
  message: 'Unsupported file type. Only JPEG and PNG are allowed.',
});

/**
 * Validates the file size.
 * The maximum allowed size is 5MB.
 */
const fileSize = z.number().max(5 * 1024 * 1024, 'File must not exceed 5MB');

/**
 * Validates that the post ID is a valid MongoDB ObjectId.
 * Leverages Mongoose's built-in ID validation.
 */
export const id = z
  .string()
  .min(1, 'ID is required')
  .refine((value) => mongoose.Types.ObjectId.isValid(value), { message: 'Invalid ID format' });

/* -------------------------------------------------------------------------- */
/*                               Composite Schema                             */
/* -------------------------------------------------------------------------- */

/**
 * Schema for a file object.
 * Includes original name, MIME type, and size.
 */
const file = z.object({
  originalname: fileName,
  mimetype: fileMimeType,
  size: fileSize,
});

/**
 * Schema for a post.
 * Requires a valid content field.
 * Optionally accepts a file object with original name, MIME type, and size.
 */
export const postSchema = z
  .object({
    content,
    file: file.optional(),
  })
  .strict();

/**
 * Type definition for post form data.
 */
export type PostFormData = z.infer<typeof postSchema>;

/**
 * Schema for validating the "id" parameter in the request.
 * Ensures that the id is a non-empty string and conforms to MongoDB's ObjectId format.
 */
export const postIdSchema = z.object({
  id,
});

/**
 * Type definition for the validated parameters.
 */
export type PostId = z.infer<typeof postIdSchema>;

/**
 * Schema for updating a post.
 * Both the "content" and "file" fields are optional,
 * however, at least one of them must be provided.
 */
export const updatePostSchema = z
  .object({
    content: content.optional(),
    file: file.optional(),
  })
  .strict()
  .refine(({ content, file }) => content || file, {
    message: 'At least content or file must be provided.',
  });

/**
 * Type definition for update post form data.
 */
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
