import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError, InternalError, ForbiddenError } from '@/errors';
// Interface for decoded JWT payload
interface AuthPayload extends JwtPayload {
  userID: string;
}

// Extend Express to inject `auth` property into `Request`
declare module 'express' {
  interface Request {
    auth?: AuthPayload;
  }
}

/**
 * Middleware to authenticate JWT from URL query token.
 *
 * This middleware extracts a token from `req.query.token`, verifies it using JWT,
 * and attaches the decoded payload to `req.auth`. It is suitable for securing
 * image or file access routes where headers can't be used (e.g., <img src="...">).
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 * @route Example: GET /api/file/user/avatar/:filename?token=JWT_HERE
 */
export const urlTokenAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    const token = req.query.token;
    const jwtSecret = process.env.JWT_SECRET;

    // Ensure token is present in the query string
    if (!token || typeof token !== 'string')
      throw new UnauthorizedError('Access token missing in URL.');

    // Ensure JWT secret is defined
    if (!jwtSecret) throw new InternalError('JWT secret is not defined in environment variables.');

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    if (!decoded.userID) throw new ForbiddenError('Invalid token payload: userID missing.');

    // Attach user ID to the request
    req.auth = { userID: decoded.userID };
    next();

    // Error handling
  } catch (error) {
    next(error);
  }
};
