import { z } from 'zod';
import { email, name, password, file } from './utils';

const avatarSchema = file(5 * 1024 * 1024, ['image/jpeg', 'image/png']);

/**
 * Schema for user registration.
 */
export const registerSchema = z
  .object({
    name: name('First name'),
    familyName: name('Family name'),
    email,
    password,
  })
  .strict();

export type RegisterDTO = z.infer<typeof registerSchema>;

/**
 * Schema for user login (sign-in).
 */
export const loginSchema = z
  .object({
    email,
    password,
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;

/**
 * Schema for updating user profile.
 */
export const updateProfileSchema = z
  .object({
    name: name('First name').optional(),
    familyName: name('Family name').optional(),
    file: avatarSchema.optional(),
  })
  .strict()
  .refine((data) => data.name || data.familyName || data.file, {
    message: 'At least one of name, familyName, or file must be provided.',
    path: ['name', 'familyName', 'file'],
  });

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;

/**
 * Schema for changing password.
 */
export const passwordSchema = z
  .object({
    password: password,
    newPassword: password,
  })
  .strict()
  .refine((values) => values.password !== values.newPassword, {
    message: 'New password must differ from current password.',
    path: ['newPassword'],
  });

export type PasswordDTO = z.infer<typeof passwordSchema>;
/**
 * Schema for deleting user account.
 */
export const deleteUserSchema = z.object({ password }).strict();

export type DeleteUserDTO = z.infer<typeof deleteUserSchema>;
