import { z, ZodType, ZodTypeDef } from 'zod';
import mongoose from 'mongoose';

/**
 * Validates a MongoDB ObjectId string.
 */
export const objectId = (name: string): ZodType<string, ZodTypeDef, string> =>
  z
    .string({ required_error: `${name} is required.` })
    .nonempty(`${name} is required.`)
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: `Invalid ${name} format.`,
    });

/**
 * Builds a file metadata validator for uploads.
 * @param maxSizeBytes - Maximum allowed file size in bytes.
 * @param allowedMimeTypes - Array of accepted MIME types.
 */
export const file = (maxSizeBytes: number, allowedMimeTypes: string[]) =>
  z.object({
    originalname: z.string().min(1, 'File name is required.'),
    mimetype: z.string().refine((t) => allowedMimeTypes.includes(t), {
      message: `Unsupported file type. Allowed: ${allowedMimeTypes.join(', ')}`,
    }),
    size: z.number().max(maxSizeBytes, `File must not exceed ${maxSizeBytes} bytes.`),
  });

/**
 * Validates email addresses.
 */
export const email = z
  .string()
  .trim()
  .email('Invalid email format.')
  .max(100, 'Email address is too long.');

/**
 * Validates passwords with strength rules.
 */
export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(50, 'Password must not exceed 50 characters.')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must include uppercase, lowercase, number, and special character.',
  );

/**
 * Validates name and family name.
 */
export const name = (name: string) =>
  z
    .string({ required_error: `${name} is required.` })
    .trim()
    .min(2, `${name} must be at least 2 characters long.`)
    .max(50, `${name} must not exceed 50 characters.`)
    .regex(/^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)*$/, 'Only alphabetic characters and spaces.');

/**
 * Validates Content.
 */
export const content = (name: string) =>
  z
    .string({ required_error: `${name} is required.` })
    .min(1, `${name} cannot be empty.`)
    .max(1000, `${name} cannot exceed 1000 characters.`);
