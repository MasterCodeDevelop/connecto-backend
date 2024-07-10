import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST } from '../../utils/httpStatus';
import { errorResponse } from '../../utils/responses';

/**
 * Base upload directory, configurable via .env or defaults to `private/uploads`
 */
const AVATAR_UPLOADS_DIR = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
  'users',
);

/**
 * Controller to securely serve a user's profile picture from the private storage.
 *
 * Requires `urlTokenAuthMiddleware` to verify the token and inject `req.auth`.
 *
 * @route   GET /api/user/avatar/:filename?token=JWT
 * @access  Private (Token in query param)
 *
 * @param req - Express request object with `filename` in params and token in query
 * @param res - Express response object
 * @returns The image file or error
 */
export const getUserAvatar = (req: Request, res: Response): Response | void => {
  const { filename } = req.params;

  // Security check: prevent directory traversal and restrict extensions
  const isValidFilename = /^[\w-]+\.(jpg|jpeg|png|webp)$/i.test(filename);
  if (!isValidFilename) {
    return errorResponse(res, 'Invalid filename format.', BAD_REQUEST);
  }

  const filePath = path.join(AVATAR_UPLOADS_DIR, filename);

  // File not found
  if (!fs.existsSync(filePath)) {
    return errorResponse(res, 'Avatar not found.', NOT_FOUND);
  }

  // erve the image securely
  return res.sendFile(filePath);
};
