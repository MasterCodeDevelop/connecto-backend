import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Schema for validating authentication payloads.
 * Intended for validating the content of a JWT token's payload in auth middleware.
 */
export const authSchema = z.object({
  // Validates that the userId exists and conforms to the MongoDB ObjectId format.
  // The error messages are generic to avoid leaking information.
  userId: z
    .string({
      required_error: 'Invalid token payload.',
    })
    .min(1, 'Invalid token payload.')
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: 'Invalid token payload.',
    }),
});

/**
 * TypeScript type inferred from the authSchema.
 * Use this type in controllers and middleware for consistency.
 */
export type AuthPayload = z.infer<typeof authSchema>;
