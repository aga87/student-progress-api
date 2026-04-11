import { RequestHandler } from 'express';
import { studentResultsService } from '../startup/container.js';

export const getAllStudentResultsHandler: RequestHandler = async (req, res) => {
  const studentResults = await studentResultsService.getAll();

  return res.status(200).json({
    data: studentResults,
  });
};
