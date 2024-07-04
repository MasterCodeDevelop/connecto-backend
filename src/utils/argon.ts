import argon2 from 'argon2';

/**
 * Hashes a plain text password securely using Argon2id.
 *
 * @param password - The plain text password to hash
 * @returns A securely hashed password string (includes salt)
 */
export async function hash(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id, // Use Argon2id for optimal security
    memoryCost: 2 ** 16, // 64 MB memory (OWASP recommended minimum)
    timeCost: 4, // Number of iterations
    parallelism: 2, // Number of threads used
  });
}
