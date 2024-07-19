import { logger } from '@/config/logger';
import { InternalError } from '@/errors';
import NodeJS from 'node:process';
type ServerErrorCode = 'EACCES' | 'EADDRINUSE';

/**
 * Handles critical server errors during startup (e.g., port in use or permission denied).
 * Logs the error and throws an InternalError for further handling.
 * @param error - NodeJS.ErrnoException
 * @param port - Port number
 */
export const handleServerError = (error: NodeJS.ErrnoException, port: number): never => {
  // Define error messages for specific error codes
  const ERROR_MESSAGES: Record<ServerErrorCode, () => string> = {
    EACCES: () => `Port ${port} requires elevated privileges.`,
    EADDRINUSE: () => `Port ${port} is already in use.`,
  };

  // Throw error if syscall is not 'listen'
  if (error.syscall !== 'listen') throw error;

  const code = error.code as ServerErrorCode;

  // Throw error if code is in ERROR_MESSAGES
  if (code in ERROR_MESSAGES) {
    const message = ERROR_MESSAGES[code]();
    logger.error(`🔴 Server startup error: ${message}`, {
      port,
      code,
      stack: error.stack,
    });
    throw new InternalError(message);
  }

  // Throw error if code is not in ERROR_MESSAGES
  logger.error('❌ Unexpected server startup error.', {
    port,
    code: error.code,
    syscall: error.syscall,
    message: error.message,
    stack: error.stack,
  });
  throw error;
};
