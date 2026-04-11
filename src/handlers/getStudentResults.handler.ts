import { RequestHandler } from 'express';
import { studentResultsService } from '../startup/container.js';

export const getStudentResultsHandler: RequestHandler = async (req, res) => {
  const studentResults = await studentResultsService.listStudentResults();

  return res.status(200).json({
    data: studentResults,
  });
};
