import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Custom error for handling JWT generation failures.
 * Allows clear distinction from other runtime errors.
 */
export class TokenGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenGenerationError';
  }
}

/**
 * Supported JWT expiration durations.
 * Helps ensure that only valid and intentional durations are used.
 */
type JwtDuration = '1h' | '2h' | '6h' | '12h' | '1d' | '7d' | '30d';

/**
 * Generates a signed JWT access token for a given payload.
 *
 * @param payload - The data to embed in the JWT (e.g., user ID, role, etc.)
 * @returns A Promise resolving to a signed JWT string
 * @throws TokenGenerationError if JWT_SECRET is missing or signing fails
 */
export const generateToken = async (payload: object): Promise<string> => {
  // Retrieve the JWT secret key from environment variables
  const jwtSecret = process.env.JWT_SECRET;

  // Retrieve the expiration duration or fallback to a default value
  const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1h') as JwtDuration;

  // Validate presence of secret
  if (!jwtSecret) {
    throw new TokenGenerationError('JWT_SECRET is not defined in environment variables.');
  }

  const signOptions: SignOptions = { expiresIn: jwtExpiresIn };

  // Wrap the async signing process in a Promise for clean async/await usage
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, signOptions, (err, token) => {
      if (err || !token) {
        return reject(
          new TokenGenerationError(`JWT signing failed: ${err?.message ?? 'Unknown error'}`),
        );
      }
      resolve(token);
    });
  });
};
