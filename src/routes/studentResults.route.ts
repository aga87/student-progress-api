import { Router } from 'express';
import { getAllStudentResultsHandler } from '../handlers/getStudentResults.handler.js';

const router = Router();

router.get('/', getAllStudentResultsHandler);

export { router as studentResultsRouter };
