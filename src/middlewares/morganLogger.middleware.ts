import morgan from 'morgan';
import { logger } from '@/config';

// Morgan stream that redirects logs to Winston's http level
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Format based on environment
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const morganMiddleware = morgan(format, { stream });
