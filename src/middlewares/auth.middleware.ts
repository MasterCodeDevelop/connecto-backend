import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ForbiddenError, InternalError, UnauthorizedError } from '@/errors';

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
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const { authorization } = req.headers;
  const jwtSecret = process.env.JWT_SECRET; // Secret key for JWT verification

  try {
    // Ensure the Authorization header exists and is correctly formatted
    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedError('Authorization header is missing or improperly formatted!');

    // Extract the token from the Authorization header
    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedError('Token is missing !');

    // Ensure the JWT secret is available in environment variables
    if (!jwtSecret) throw new InternalError('JWT secret key is missing in environment variables!');

    // Verify the JWT and extract its payload
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    // Ensure the token contains a valid user ID
    if (!decoded.userID) throw new ForbiddenError('Invalid token! Access denied.');

    // Attach the authenticated user data to the request object
    req.auth = { userID: decoded.userID };

    // Proceed to the next middleware
    next();

    //  Handle Errors
  } catch (error) {
    next(error);
  }
};
