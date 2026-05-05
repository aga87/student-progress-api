import { type ErrorRequestHandler } from 'express';
import { getErrorMessage, getErrorStatusCode } from '../models/index.js';
import { logger } from '../logging/logger.js';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  const statusCode = getErrorStatusCode(err);
  const message = getErrorMessage(err);

  logger.error('Error occurred', {
    message,
    stack: err instanceof Error ? err.stack : undefined,
    statusCode,
    method: req.method,
    path: req.path,
  });

  res.status(statusCode).json({
    error: message,
  });
};
