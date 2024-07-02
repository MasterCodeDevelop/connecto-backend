import mongoose from 'mongoose';
import { color } from '../utils/color';
import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

/**
 * Defines the shape of required database configuration.
 */
interface DatabaseConfig {
  user: string | undefined;
  password: string | undefined;
  name: string | undefined;
}

/**
 * Load database configuration from environment variables.
 */
const dbConfig: DatabaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
};

/**
 * Validates the database configuration by ensuring all necessary environment variables are set.
 * If any variable is missing, logs an error message with the missing keys.
 * @returns {boolean} - Returns true if all required environment variables are present, false otherwise.
 */
const validateDbConfig = (): boolean => {
  const missingKeys = Object.entries(dbConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error(color.red(`❌ Missing environment variables: ${missingKeys.join(', ')}`));
    return false;
  }
  return true;
};

/**
 * Builds the MongoDB connection URI.
 * You can switch between local and cloud connection modes.
 */
const getMongoUri = (): string => {
  const { name } = dbConfig;

  // Localhost (recommended for development)
  return `${process.env.DB_URI}/${name}`;

  // Cloud MongoDB Atlas (uncomment to use with credentials)
  // const { user, password, name } = config;
  // return `mongodb+srv://${user}:${password}@cluster.mongodb.net/${name}?retryWrites=true&w=majority`;
};

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Ensures configuration is valid, and handles errors gracefully.
 */
const connectToDatabase = async (): Promise<void> => {
  if (!validateDbConfig()) {
    console.error(color.yellow('⚠️ Database connection aborted due to config issues.'));
    return;
  }

  const mongoURI = getMongoUri();

  console.log(color.cyan(`🔄 Connecting to MongoDB... (${mongoURI})`));

  try {
    await mongoose.connect(mongoURI);
    console.log(color.green('✅ MongoDB connection successful.'));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(color.red(`❌ MongoDB connection failed: ${error.message}`));

      if (
        error.message.includes('Authentication failed') ||
        error.message.includes('not authorized')
      ) {
        console.error(color.red('⚠️ Check your MongoDB credentials.'));
      }

      process.exit(1); // Exit the process on fatal error
    } else {
      console.error(color.red('❌ Unknown error while connecting to MongoDB.'));
      process.exit(1);
    }
  }
};

export default connectToDatabase;
