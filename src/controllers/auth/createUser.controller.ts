import { Request, Response } from 'express';
import User from '../../models/User';
import { hash } from '../../utils/argon';
import generateToken, { TokenGenerationError } from '../../utils/jwt';
import { errorResponse, successResponse } from '../../utils/responses';
import { CREATED, INTERNAL_SERVER_ERROR, CONFLICT } from '../../utils/httpStatus';

/**
 * Controller responsible for handling user registration :
 *
 * - Check if email already exists
 * - Hash the password securely
 * - Create and save the new user
 * - Generate a signed JWT token
 * - Return token in success response
 *
 * @route   POST /api/auth/signup
 * @param req - Express request object
 * @param res - Express response object
 * @returns Express response with status and data
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { familyName, name, email, password } = req.body;

    // Check for duplicate user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) return errorResponse(res, 'This email already exists.', CONFLICT);

    // Hash the password using Argon2
    const hashedPassword = await hash(password);

    // Create and save the new user in the database
    const newUser = await User.create({
      name,
      familyName,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for the newly registered user
    try {
      const token = await generateToken({ userID: newUser._id });

      // Return success response
      return successResponse(res, 'User created successfully.', { token }, CREATED);

      // Handle unexpected errors
    } catch (err: unknown) {
      // Handle JWT-specific failures
      if (err instanceof TokenGenerationError) {
        console.error('[createUser] Token generation error:', err.message);
        return errorResponse(res, 'Token generation failed. Please try again later.');
      }

      // Fallback for unexpected errors during token creation
      console.error('[createUser] Unexpected error during token creation:', err);
      return errorResponse(res, 'An unexpected error occurred during token generation.');
    }

    // Global error handler for registration flow
  } catch (err: unknown) {
    console.error('[createUser] Registration error:', err);
    return errorResponse(
      res,
      'Registration failed. Please try again later.',
      INTERNAL_SERVER_ERROR,
      err,
    );
  }
};

export default createUser;
