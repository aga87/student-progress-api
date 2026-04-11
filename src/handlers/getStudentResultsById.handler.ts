import { RequestHandler } from 'express';
import { studentResultsService } from '../startup/container.js';

export const getStudentResultsByIdHandler: RequestHandler = async (
  req,
  res
) => {
  const studentId = Number(req.params.studentId);

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({
      message: 'Student ID must be a positive integer',
    });
  }

  const studentResults = await studentResultsService.getByStudentId(studentId);

  if (!studentResults) {
    return res.status(404).json({
      message: 'Student not found',
    });
  }

  return res.status(200).json({ ...studentResults });
};
