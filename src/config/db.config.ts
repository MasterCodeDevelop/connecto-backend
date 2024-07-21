import mongoose from 'mongoose';
import { logger } from './logger.config';
import { InternalError } from '@/errors';
import { validateDbConfig, getMongoUri, handleMongoConnectionError } from '@/utils/dbUtils';

/**
 * Connects to the MongoDB database using Mongoose.
 * Throws an error if the connection fails.
 */
export const connectToDatabase = async (): Promise<void> => {
  // Validate DB config from environment variables
  if (!validateDbConfig()) {
    throw new InternalError('Database configuration validation failed.');
  }

  // Build the MongoDB URI string
  const mongoURI = getMongoUri();
  logger.debug(`🔄 Attempting to connect to MongoDB at URI: ${mongoURI}`);

  // Attempt to connect using Mongoose
  try {
    await mongoose.connect(mongoURI);
    logger.info('✅ Successfully connected to MongoDB.');
  } catch (error: unknown) {
    handleMongoConnectionError(error, mongoURI);
  }
};
