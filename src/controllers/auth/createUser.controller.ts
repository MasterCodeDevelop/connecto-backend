import { Request, Response } from 'express';
import User from '../../models/User';
import { hash } from '../../utils/argon';
import generateToken, { TokenGenerationError } from '../../utils/jwt';
import { errorResponse, successResponse } from '../../utils/responses';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, CONFLICT } from '../../utils/httpStatus';
import { registerSchema } from '../../validations/user.validation';
/**
 * Controller responsible for handling user registration.
 * Workflow:
 * - Validates incoming request body using Zod
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
    // Validate input
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map((i) => i.message).join(', ');
      return errorResponse(res, errorMessages, BAD_REQUEST);
    }

    const { familyName, name, email, password } = validation.data;
    // Check for duplicate user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(CONFLICT).json({
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
      return successResponse(res, 'User created successfully.', { token }, CREATED);
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
  } catch (err: unknown) {
    // Global error handler for registration flow
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
