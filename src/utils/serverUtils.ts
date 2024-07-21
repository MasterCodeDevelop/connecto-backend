import { Server } from 'http';
import { logger } from '@/config';
import { InternalError } from '@/errors';

/**
 * Normalizes the port value retrieved from environment variables.
 *
 * Converts the input string to a valid port number.
 * If the value is undefined, NaN or less than or equal to 0, the default port 3000 is used.
 *
 * @param value - The port value as a string or undefined (e.g., process.env.PORT).
 * @returns A valid port number.
 */
export const normalizePort = (value: string | undefined): number => {
  const port = Number(value);
  return isNaN(port) || port <= 0 ? 3000 : port;
};

/**
 * Factory function to create an "onListening" event handler for the HTTP server.
 *
 * Logs when the server has successfully started and is listening on the specified port.
 *
 * @param server - The HTTP server instance created with `http.createServer()`.
 * @param port - The port number on which the server is expected to listen.
 * @returns A function to be passed to the 'listening' event of the server.
 */
export const createOnListening = (server: Server, port: number): (() => void) => {
  return () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? addr : `http://localhost:${port}`;
    logger.info('✅ Server is up and running');
    logger.info(`📡 Listening at ${bind}`);
  };
};

/**
 * Sets up graceful shutdown handlers for system signals (SIGINT, SIGTERM).
 *
 * When the server receives a shutdown signal, this function:
 * - Logs the signal received.
 * - Closes the HTTP server cleanly.
 * - Throws an InternalError to signal controlled termination.
 *
 * Note: This approach avoids `process.exit()` for better testability and ESLint compliance.
 *
 * @param server - The HTTP server instance to be shut down gracefully.
 */
export const setupGracefulShutdown = (server: Server): void => {
  const shutdown = (signal: string) => {
    logger.warn(`🛑 Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
      logger.info('🔒 Server closed successfully.');
      throw new InternalError(`Server shutdown completed after receiving signal: ${signal}`);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};
