import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError, InternalError } from '@/errors';

// Interface defining the expected structure of the JWT payload
interface AuthPayload extends JwtPayload {
  userID: string;
}
// Extending the Express Request object to include authentication data
declare module 'express' {
  interface Request {
    auth?: AuthPayload;
  }
}

// Interface for authentication middleware options
interface AuthOptions {
  allowUrlToken?: boolean;
}

/**
 * JWT authentication middleware.
 * Supports both Authorization header and optional URL query (?token=).
 *
 * @param options - allowUrlToken: if true, accepts token from URL query
 * @returns Express middleware function
 */
export const authMiddleware =
  (options: AuthOptions = {}) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { allowUrlToken = false } = options;

    try {
      const tokenFromUrl =
        allowUrlToken && typeof req.query.token === 'string' ? req.query.token : null;
      const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null;

      // Check if token is present
      const token = tokenFromUrl || tokenFromHeader;
      if (!token) throw new UnauthorizedError('Access token is required.');

      // Ensure the JWT secret is available in environment variables
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret)
        throw new InternalError('JWT secret is not defined in environment variables.');

      // Verify and decode the token
      const decoded = jwt.verify(token, jwtSecret) as AuthPayload;
      if (!decoded.userID) {
        throw new ForbiddenError('Invalid token payload: userID is missing.');
      }

      // Attach user ID to auth request and pass control to the next middleware
      req.auth = { userID: decoded.userID };
      next();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case 'TokenExpiredError':
            return next(new UnauthorizedError('Session expired. Please log in again.'));
          case 'JsonWebTokenError':
            return next(new UnauthorizedError('Invalid token format.'));
          case 'NotBeforeError':
            return next(new UnauthorizedError('Token not active yet.'));
        }
      }

      return next(error);
    }
  };
