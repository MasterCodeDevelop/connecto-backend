import winston from 'winston';
import path from 'path';
import util from 'util';

/**
 * Custom log levels for clarity and structured output.
 */
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Custom colors for console output by log level.
 */
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(customColors);

/**
 * Console formatter with colorized, structured, multi-line output.
 */
const consoleFormat = winston.format.printf((info) => {
  const { timestamp, level, message } = info;

  // Extract potential context object
  const splat = info[Symbol.for('splat')] as [Record<string, unknown>] | undefined;
  const context = splat && typeof splat[0] === 'object' ? splat[0] : null;

  // Base log line
  let output = `[${timestamp}] ${level}: ${message}`;

  // Pretty-print structured context below
  if (context) {
    const { stack, ...rest } = context;

    // Print the rest of the context (without stack)
    if (Object.keys(rest).length > 0) {
      output +=
        '\n' +
        util.inspect(rest, {
          depth: 4,
          colors: true,
          compact: false,
          breakLength: 120,
        });
    }

    // Format and print the stack separately, nicely indented
    if (typeof stack === 'string') {
      const formattedStack = stack
        .split('\n')
        .map((line) => `  ${line.trim()}`)
        .join('\n');

      // Add stack trace
      output += `\n\n  Stack Trace:\n${formattedStack}`;
    }
  }

  return output;
});

/**
 * File formatter for structured JSON logging with stack traces.
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/**
 * Winston logger instance with environment-specific transports.
 */
export const logger = winston.createLogger({
  levels: customLevels,
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat,
      ),
    }),

    // Additional transports for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: path.join('logs', 'errors.log'),
            level: 'error',
            format: fileFormat,
          }),
          new winston.transports.File({
            filename: path.join('logs', 'http.log'),
            level: 'http',
            format: fileFormat,
          }),
        ]
      : []),
  ],
});
