import path from 'path';

/**
 * Determine the base directory for file uploads.
 *
 * This path is configurable via the environment variable `UPLOADS_BASE_PATH`.
 * If the variable is not set, it defaults to 'private/uploads' within the project root.
 */
export const BASE_UPLOADS_DIR: string = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
);

/**
 * Define specific upload paths for different application areas.
 *
 * The directory paths for uploading assets (for example, posts and users)
 * are constructed by appending the respective sub-directory to the BASE_UPLOADS_DIR.
 */
export const UPLOADS_PATHS = {
  posts: path.join(BASE_UPLOADS_DIR, 'posts'),
  users: path.join(BASE_UPLOADS_DIR, 'users'),
};
