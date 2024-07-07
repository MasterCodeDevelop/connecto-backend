import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR, FORBIDDEN } from '../utils/httpStatus';
import errorResponse from '../utils/errorResponse';

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

/**
 * Middleware for authenticating JWT tokens.
 *
 * This middleware verifies the JWT provided in the Authorization header.
 * If valid, it extracts user details and appends them to the request object.
 * If invalid or missing, it responds with an appropriate error.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 * @returns Response object in case of an error, otherwise calls next()
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { authorization } = req.headers;
  const jwtSecret = process.env.JWT_SECRET; // Secret key for JWT verification

  // Ensure the Authorization header exists and is correctly formatted
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return errorResponse(
      res,
      'Authorization header is missing or improperly formatted!',
      UNAUTHORIZED,
    );
  }

  // Extract the token from the Authorization header
  const token = authorization.split(' ')[1];
  if (!token) {
    return errorResponse(res, 'Token is missing!', UNAUTHORIZED);
  }

  // Ensure the JWT secret is available in environment variables
  if (!jwtSecret) {
    return errorResponse(
      res,
      'JWT secret key is missing in environment variables!',
      INTERNAL_SERVER_ERROR,
    );
  }

  try {
    // Verify the JWT and extract its payload
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    // Ensure the token contains a valid user ID
    if (!decoded.userID) {
      return errorResponse(res, 'Invalid token! Access denied.', FORBIDDEN);
    }

    // Attach the authenticated user data to the request object
    req.auth = { userID: decoded.userID };

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle different JWT errors appropriately
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 'Token expired! Please log in again.', UNAUTHORIZED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 'Invalid token! Access denied.', UNAUTHORIZED);
    }

    // Catch-all for unexpected errors
    return errorResponse(res, 'Internal server error', INTERNAL_SERVER_ERROR);
  }
};

export default authMiddleware;
