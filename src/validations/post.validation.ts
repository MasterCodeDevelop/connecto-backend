import { z } from 'zod';

/**
 * Define the validation for the "content" field.
 */
const contentField = z
  .string({
    required_error: 'Content is required.',
  })
  .min(10, 'Content must be at least 10 characters long.')
  .max(5000, 'Content cannot exceed 5000 characters.');

/**
 * Field validation: file.originalname
 */
const fileNameField = z.string().min(1, 'File name is required');

/**
 * Field validation: file.mimetype
 * Only accepts JPEG and PNG.
 */
const fileMimeTypeField = z.string().refine((type) => ['image/jpeg', 'image/png'].includes(type), {
  message: 'Unsupported file type. Only JPEG and PNG are allowed.',
});

/**
 * Field validation: file.size
 * Maximum file size: 5MB
 */
const fileSizeField = z.number().max(5 * 1024 * 1024, 'File must not exceed 5MB');

/**
 * Schema for post.
 * Requires content and an optional file.
 */
export const postSchema = z
  .object({
    content: contentField,
    file: z
      .object({
        originalname: fileNameField,
        mimetype: fileMimeTypeField,
        size: fileSizeField,
      })
      .optional(),
  })
  .strict();

/**
 * Type definition for post.
 */
export type PostFormData = z.infer<typeof postSchema>;
