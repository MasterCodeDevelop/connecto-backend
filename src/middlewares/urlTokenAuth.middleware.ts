import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UNAUTHORIZED, FORBIDDEN } from '../utils/httpStatus';
import { errorResponse } from '../utils/responses';

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
const urlTokenAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const token = req.query.token;
  const jwtSecret = process.env.JWT_SECRET;

  // Ensure token is present in the query string
  if (!token || typeof token !== 'string') {
    return errorResponse(res, 'Access token missing in URL.', UNAUTHORIZED);
  }
  // Ensure JWT secret is defined
  if (!jwtSecret) {
    return errorResponse(res, 'JWT secret is not defined in environment variables.');
  }
  // Verify and decode the token
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    if (!decoded.userID) {
      return errorResponse(res, 'Invalid token payload: userID missing.', FORBIDDEN);
    }
    // Attach user ID to the request
    req.auth = { userID: decoded.userID };
    next();
  } catch (error) {
    // Token expired
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 'Token has expired. Please request a new one.', UNAUTHORIZED);
    }
    // Invalid token
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 'Invalid token. Access denied.', UNAUTHORIZED);
    }
    // server error
    return errorResponse(res, 'Unexpected error while validating token.');
  }
};

export default urlTokenAuthMiddleware;
