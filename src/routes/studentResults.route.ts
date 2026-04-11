import { Router } from 'express';
import {
  createStudentResultHandler,
  getAllStudentResultsHandler,
  getStudentResultsByIdHandler,
} from '../handlers/index.js';

const router = Router();

router.get('/', getAllStudentResultsHandler);

router.post('/', createStudentResultHandler);

router.get('/:studentId', getStudentResultsByIdHandler);

export { router as studentResultsRouter };
