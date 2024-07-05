import { Request, Response } from 'express';
import User from '../../models/User';
import { hash } from '../../utils/argon';
import generateToken, { TokenGenerationError } from '../../utils/jwt';
import errorResponse from '../../utils/errorResponse';
import { HttpStatus } from '../../utils/httpStatus';

/**
 * Controller responsible for handling user registration.
 * Workflow:
 * Check if email already exists
 * Hash the password securely
 * Create and save the new user
 * Generate a signed JWT token
 * Return token in success response
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Express response with status and data
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { familyName, name, email, password } = req.body;

    // Check for duplicate user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'This email is already in use.',
      });
    }

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
      const tokenPayload = { userID: newUser._id };
      const token = await generateToken(tokenPayload);

      // Return success response
      return res.status(201).json({
        message: 'User created successfully.',
        token,
      });
    } catch (err: unknown) {
      // Handle JWT-specific failures
      if (err instanceof TokenGenerationError) {
        console.error('[createUser] Token generation error:', err.message);
        return errorResponse(
          res,
          'Token generation failed. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Fallback for unexpected errors during token creation
      console.error('[createUser] Unexpected error during token creation:', err);
      return errorResponse(
        res,
        'An unexpected error occurred during token generation.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } catch (err: unknown) {
    // Global error handler for registration flow
    console.error('[createUser] Registration error:', err);
    return errorResponse(
      res,
      'Registration failed. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      err,
    );
  }
};

export default createUser;
