import { z } from 'zod';

/**
 * Common field schemas for authentication and user data validation.
 * Each schema is designed to enforce specific constraints
 * for the corresponding field using Zod.
 */
const emailField = z
  .string()
  .trim()
  .email('Invalid email format.')
  .max(100, 'Email address is too long.');

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(50, 'Password must not exceed 50 characters.')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must include uppercase, lowercase, number, and special character.',
  );

const newPasswordField = z
  .string()
  .min(8, 'New password must be at least 8 characters long.')
  .max(50, 'New password must not exceed 50 characters.')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'New password must include uppercase, lowercase, number, and special character.',
  );
const nameField = z
  .string()
  .trim()
  .min(2, 'First name must be at least 2 characters long.')
  .max(50, 'First name must not exceed 50 characters.')
  .regex(
    /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)*$/,
    'First name can only contain alphabetic characters and spaces.',
  );

const familyNameField = z
  .string()
  .trim()
  .min(2, 'Family name must be at least 2 characters long.')
  .max(50, 'Family name must not exceed 50 characters.')
  .regex(
    /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)*$/,
    'Family name can only contain alphabetic characters and spaces.',
  );

/**
 * Schema for user registration (sign-up).
 * Validates full user profile input.
 */
export const registerSchema = z
  .object({
    name: nameField,
    familyName: familyNameField,
    email: emailField,
    password: passwordField,
  })
  .strict();

export type RegisterDTO = z.infer<typeof registerSchema>;

/**
 * Schema for user login (sign-in).
 * Requires only email and password.
 */
export const loginSchema = z
  .object({
    email: emailField,
    password: passwordField,
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

/**
 * Schema for profile update (optional name/familyName)
 * At least one field is required.
 */
export const updateProfileSchema = z
  .object({
    name: nameField.optional(),
    familyName: familyNameField.optional(),
  })
  .refine((data) => data.name || data.familyName, {
    message: 'At least one field (name or familyName) must be provided.',
  });

/**
 * Schema for updating a password.
 *
 * This schema enforces that:
 * - The current password and the new password meet the defined validation rules.
 * - The new password must be different from the current password.
 *
 * The `strict()` method is used to disallow any extra keys in the object.
 */
export const passwordSchema = z
  .object({
    password: passwordField,
    newPassword: newPasswordField,
  })
  .strict()
  .refine((data) => data.password !== data.newPassword, {
    message: 'The new password must be different from the current password.',
    path: ['newPassword'],
  });

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
