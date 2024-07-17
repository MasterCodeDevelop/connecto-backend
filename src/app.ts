import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/corsConfig';
import router from './routes';
import { errorHandler } from './middlewares';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectToDatabase();

/**
 * Apply security-related HTTP headers using Helmet
 * - Disables CSP and COEP temporarily for compatibility with development or specific frontend needs
 *   You can re-enable them later for production hardening
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// Enable Cross-Origin Resource Sharing with custom options
app.use(cors(corsOptions()));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse URL-encoded payloads (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

/**
 * API routes are prefixed with '/api'
 */
app.use('/api', router);

//  Mount the global error handler (MUST be last)
app.use(errorHandler);

export default app;
