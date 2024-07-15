import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST } from '../../utils/httpStatus';
import { errorResponse } from '../../utils/responses';

/**
 * Base upload directory, configurable via .env or defaults to `private/uploads`
 */
const POST_UPLOADS_DIR = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
  'posts',
);

/**
 * Controller to securely serve a post's file from the private storage.
 *
 * Requires `urlTokenAuthMiddleware` to verify the token and inject `req.auth`.
 *
 * @route   GET /api/post/file/:filename?token=JWT
 * @access  Private (Token in query param)
 * @param req - Express request object with `filename` in params and token in query
 * @param res - Express response object
 * @returns The image file or error
 */
export const getPostFile = (req: Request, res: Response): Response | void => {
  const { filename } = req.params;
  const filePath = path.join(POST_UPLOADS_DIR, filename);

  // Security check: prevent directory traversal and restrict extensions
  const isValidFilename = /^[\w-]+\.(jpg|jpeg|png|webp)$/i.test(filename);
  if (!isValidFilename) return errorResponse(res, 'Invalid post filename format.', BAD_REQUEST);

  // File not found
  if (!fs.existsSync(filePath)) return errorResponse(res, 'Post file not found.', NOT_FOUND);

  // erve the file securely
  return res.sendFile(filePath);
};
