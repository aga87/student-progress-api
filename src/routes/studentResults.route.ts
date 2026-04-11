import { Router } from 'express';
import { getStudentResultsHandler } from '../handlers/getStudentResults.handler.js';

const router = Router();

router.get('/', getStudentResultsHandler);

export { router as studentResultsRouter };
