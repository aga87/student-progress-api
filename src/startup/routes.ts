import express, { type Application } from 'express';
import helmet from 'helmet';
import { healthCheckRouter } from '../routes/healthCheck.route.js';
import { studentResultsRouter } from '../routes/studentResults.route.js';
import { errorMiddleware } from '../middleware/error.middleware.js';

export const routes = (app: Application) => {
  app.use(helmet());
  app.use(express.json());
  app.use('/health-check', healthCheckRouter);
  app.use('/api/v1/student-results', studentResultsRouter);

  app.use(errorMiddleware);
};
