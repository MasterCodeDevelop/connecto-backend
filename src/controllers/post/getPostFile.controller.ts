import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@/errors';
import { UPLOADS_PATHS } from '@/config';

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
export const getPostFile = async (req: Request, res: Response): Promise<Response | void> => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_PATHS.posts, filename);

  // Security check: prevent directory traversal and restrict extensions
  const isValidFilename = /^[\w-]+\.(jpg|jpeg|png|webp)$/i.test(filename);
  if (!isValidFilename) throw new BadRequestError('Invalid post filename format.');

  // File not found
  if (!fs.existsSync(filePath)) throw new NotFoundError('Post file not found.');

  // erve the file securely
  return res.sendFile(filePath);
};
