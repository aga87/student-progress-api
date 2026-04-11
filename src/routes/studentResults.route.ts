import { Router } from 'express';
import {
  getAllStudentResultsHandler,
  getStudentResultsByIdHandler,
} from '../handlers/index.js';

const router = Router();

router.get('/', getAllStudentResultsHandler);

router.get('/:studentId', getStudentResultsByIdHandler);

export { router as studentResultsRouter };
