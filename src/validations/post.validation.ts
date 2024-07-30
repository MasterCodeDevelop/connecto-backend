import { z } from 'zod';
import { objectId, file, content } from './utils';

const imageSchema = file(5 * 1024 * 1024, ['image/jpeg', 'image/png']);

/**
 * Body schema for creating a post.
 */
export const postSchema = z
  .object({
    content: content('Post content'),
    file: imageSchema.optional(),
  })
  .strict();

export type PostDTO = z.infer<typeof postSchema>;

/**
 * Route parameter schema for post ID.
 */
export const postIdSchema = z.object({
  id: objectId('Post ID'),
});

/**
 * Type definition for the validated parameters.
 */
export type PostId = z.infer<typeof postIdSchema>;
/**
 * Body schema for updating a post (at least one field required).
 */
export const updatePostSchema = z
  .object({
    content: content('Post content').optional(),
    file: imageSchema.optional(),
  })
  .strict()
  .refine(({ content, file }) => content || file, {
    message: 'At least content or file must be provided.',
  });

/**
 * Type definition for update post form data.
 */
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
