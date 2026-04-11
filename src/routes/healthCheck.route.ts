import { Router } from 'express';
import { healthCheckHandler } from '../handlers/healthCheck.handler.js';

const router = Router();

router.get('/', healthCheckHandler);

export { router as healthCheckRouter };
