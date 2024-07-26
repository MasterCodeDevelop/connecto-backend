import { Request, Response, NextFunction } from 'express';
import { User } from '@/models';
import { hash, generateToken, successResponse, CREATED } from '@/utils';
import { ConflictError, InternalError } from '@/errors';

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
export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response | NextFunction | void> => {
  const { familyName, name, email, password } = req.body;

  // Check for duplicate user
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) throw new ConflictError('This email already exists.');

  // Hash the password using Argon2
  const hashedPassword = await hash(password);
  if (!hashedPassword) throw new InternalError('Password hashing failed.');

  // Create and save the new user in the database
  const newUser = await User.create({
    name,
    familyName,
    email,
    password: hashedPassword,
  });

  // Generate a JWT token for the newly registered user
  const token = await generateToken({ userID: newUser._id });
  if (!token) throw new InternalError('JWT signing failed.');

  // Return success response
  return successResponse(res, 'User created successfully.', { token }, CREATED);
};
