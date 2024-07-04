import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../models/User';
import { hash } from '../../utils/argon';

/**
 * Handles user registration.
 * Steps:
 * - Checks for duplicate email
 * - Hashes the password securely
 * - Creates and saves the user
 * - Returns a signed JWT
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { familyName, name, email, password } = req.body;

    // Check for existing user (ensure index on "email" field in MongoDB)
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'This email is already in use.',
      });
    }

    // Secure password hashing with Argon2
    const hashedPassword = await hash(password);

    // Create and persist new user
    const newUser = await User.create({
      name,
      familyName,
      email,
      password: hashedPassword,
    });

    // Securely generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({
        error: true,
        message: 'Server misconfiguration. Missing JWT secret.',
      });
    }

    const tokenPayload = { userID: newUser._id };
    const signOptions: SignOptions = { expiresIn: jwtExpiresIn };

    const token = jwt.sign(tokenPayload, jwtSecret, signOptions);

    // Success response
    return res.status(201).json({
      message: 'User created successfully.',
      token,
    });
  } catch (err: unknown) {
    console.error('[createUser] Registration error:', err);
    return res.status(500).json({
      error: true,
      message: 'Registration failed. Please try again later.',
    });
  }
};

export default createUser;
