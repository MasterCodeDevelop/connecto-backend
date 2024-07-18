import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { InternalError } from '@/errors';

/**
 * Validates whether a string is a valid JWT expiration format.
 * Accepts formats like '1h', '2d', '60'etc.
 *
 * @param value - The string to validate.
 * @returns True if the string is a valid JWT expiration format, false otherwise.
 */
const isValidJwtDuration = (value: string): boolean => {
  return /^[1-9]\d*\s*(s|m|h|d|w|y|ms)?$/.test(value.trim()); // ex: "1h", "2d", "30d"
};
/**
 * Environment configuration keys for JWT settings.
 */
const getJwtConfig = (): { secret: Secret; expiresIn: string } => {
  const secret = process.env.JWT_SECRET;
  const rawExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '1h';

  if (!secret) {
    throw new InternalError('Missing JWT_SECRET in environment variables.');
  }
  if (!isValidJwtDuration(rawExpiresIn)) {
    throw new InternalError(`Invalid JWT_EXPIRES_IN value: "${rawExpiresIn}"`);
  }

  return { secret, expiresIn: rawExpiresIn };
};

/**
 * Generates a signed JWT token asynchronously.
 *
 * @param payload - The payload to embed inside the token (e.g., user ID, roles, permissions).
 * @returns Promise<string> - The signed JWT token.
 * @throws TokenGenerationError if the secret is missing or signing fails.
 */
export const generateToken = async (payload: object): Promise<string> => {
  const { secret, expiresIn } = getJwtConfig();

  const signOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, signOptions, (err, token) => {
      if (err || !token) {
        return reject(new InternalError(`JWT signing failed: ${err?.message ?? 'Unknown error'}`));
      }
      resolve(token);
    });
  });
};
