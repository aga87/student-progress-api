import 'dotenv/config';
import express from 'express';
import { debugLog } from './logging/index.js';

const app = express();

app.get('/ping', (_req, res) => {
  res.send('Hello World');
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => debugLog(`Server listening on port ${port}...`));
