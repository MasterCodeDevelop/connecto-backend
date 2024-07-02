import { color } from './color';

/**
 * Handles server startup errors such as permission issues or port conflicts.
 *
 * @param error - The error thrown when starting the server.
 * @param port - The port number the server is attempting to bind to.
 */
export const handleServerError = (error: NodeJS.ErrnoException, port: number): void => {
  // Ignore non-listen related errors
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Define known error codes and their messages
  const errorMessages: Record<string, string> = {
    EACCES: `❌ Port ${port} requires elevated privileges.`,
    EADDRINUSE: `❌ Port ${port} is already in use.`,
  };

  const message = errorMessages[error.code ?? ''] ?? null;

  if (message) {
    console.error(color.red(message));
    process.exit(1); // Exit the process with failure
  } else {
    // Unknown error → rethrow
    throw error;
  }
};
