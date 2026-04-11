import { ErrorRequestHandler } from 'express';
import { HttpError } from '../models/index.js';
import { logger } from '../logging/logger.js';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Unexpected server error';

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error('Error occurred', {
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    statusCode,
  });

  res.status(statusCode).json({
    error: message,
  });
};
