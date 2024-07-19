import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import {
  handleServerError,
  normalizePort,
  createOnListening,
  setupGracefulShutdown,
} from './utils';

dotenv.config();

// Get port from env or fallback to 3000
const PORT = normalizePort(process.env.PORT);
app.set('port', PORT);

// Create HTTP server
const server = http.createServer(app);

// Bind server lifecycle events
server.on('error', (error) => handleServerError(error, PORT));
server.on('listening', createOnListening(server, PORT));
setupGracefulShutdown(server);

// Start server
server.listen(PORT);
