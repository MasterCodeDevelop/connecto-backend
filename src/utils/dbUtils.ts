import { InternalError } from '@/errors';
import { logger } from '@/config';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  user?: string;
  password?: string;
  name?: string;
  uri?: string;
}

/**
 * Load and expose DB environment configuration.
 */
export const dbConfig: DatabaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  uri: process.env.DB_URI,
};

/**
 * Ensure required DB environment variables are set.
 */
export const validateDbConfig = (): boolean => {
  const missingKeys = Object.entries(dbConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    logger.error(`❌ Missing environment variables: ${missingKeys.join(', ')}`);
    return false;
  }

  return true;
};

/**
 * Build a complete MongoDB URI from the environment config.
 * Supports Atlas or local MongoDB setups.
 */
export const getMongoUri = (): string => {
  const { uri, user, password, name } = dbConfig;

  if (!uri || !name) {
    throw new InternalError('DB_URI or DB_NAME is not defined in environment variables.');
  }

  // Handle MongoDB Atlas
  if (uri.includes('mongodb+srv')) {
    if (!user || !password) {
      throw new InternalError('MongoDB Atlas credentials (DB_USER, DB_PASSWORD) are missing.');
    }
    return `mongodb+srv://${user}:${password}@${uri}/${name}?retryWrites=true&w=majority`;
  }

  return `${uri}/${name}`;
};

/**
 * Handles and logs MongoDB connection errors.
 *
 * @param error - The thrown error during connection attempt.
 * @param uri - The MongoDB URI attempted.
 * @throws {InternalError} - Wrapped error with additional context.
 */
export const handleMongoConnectionError = (error: unknown, uri: string): never => {
  if (error instanceof Error) {
    logger.error('❌ MongoDB connection failed.', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      uri,
    });

    if (error.message.toLowerCase().includes('authentication failed')) {
      logger.warn('⚠️ Authentication failed. Please verify your MongoDB username and password.');
    }

    throw new InternalError('Failed to establish MongoDB connection.', {
      uri,
      reason: error.message,
    });
  }

  throw new InternalError('Unknown error occurred while connecting to MongoDB.');
};
