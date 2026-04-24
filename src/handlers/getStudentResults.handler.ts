import { RequestHandler } from 'express';
import { studentResultsQueryService } from '../startup/container.js';

export const getAllStudentResultsHandler: RequestHandler = async (req, res) => {
  const studentResults = await studentResultsQueryService.getAll();

  return res.status(200).json({
    data: studentResults,
  });
};
