import 'dotenv/config';
import express from 'express';
import { debugLog } from './logging/index.js';
import { routes } from './startup/routes.js';

const app = express();

routes(app);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => debugLog(`Server listening on port ${port}...`));
