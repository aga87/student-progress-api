import 'dotenv/config';
import express from 'express';
import { debugLog, logger } from './logging/index.js';
import { routes } from './startup/routes.js';

process.on('uncaughtException', error => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  logger.error('Unhandled promise rejection', reason);
  process.exit(1);
});

const app = express();

routes(app);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => debugLog(`Server listening on port ${port}...`));
