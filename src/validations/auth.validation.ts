import { z } from 'zod';
import { objectId } from './utils';

export const authSchema = z.object({
  /**
   * MongoDB user ID extracted from JWT payload.
   */
  userID: objectId('Authenticated'),
});

export type AuthPayload = z.infer<typeof authSchema>;
