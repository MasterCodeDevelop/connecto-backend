import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { handleServerError } from './utils/errorHandler';
import { color } from './utils/color';

dotenv.config();

/**
 * Normalize the port value from environment or fallback to 3000.
 */
const normalizePort = (value: string | undefined): number => {
  const port = Number(value);
  return isNaN(port) ? 3000 : port;
};
const PORT = normalizePort(process.env.PORT);
app.set('port', PORT);

// Create HTTP server with Express app
const server = http.createServer(app);

// Handle server events
server.on('error', (error) => handleServerError(error, PORT));

// Handle successful listening
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? addr : `http://localhost:${PORT}`;
  console.log(color.green('✅ Server is up and running'));
  console.log(`📡 Listening at ${color.blue(bind)}`);
});

// Start the server
server.listen(PORT);
