import { z } from 'zod';

/**
 * Validation schema for user registration using Zod.
 * Ensures clean and secure user input for account creation.
 */
export const userValidationSchema = z
  .object({
    familyName: z
      .string()
      .trim()
      .min(2, 'Family name must be at least 2 characters long.')
      .max(50, 'Family name must not exceed 50 characters.')
      .regex(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        'Family name can only contain alphabetic characters and spaces.',
      ),

    name: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters long.')
      .max(50, 'First name must not exceed 50 characters.')
      .regex(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        'First name can only contain alphabetic characters and spaces.',
      ),

    email: z.string().trim().email('Invalid email format.').max(100, 'Email address is too long.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(50, 'Password must not exceed 50 characters.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must include uppercase, lowercase, number, and special character.',
      ),
  })
  .strict();

export type UserRegistrationDTO = z.infer<typeof userValidationSchema>;
