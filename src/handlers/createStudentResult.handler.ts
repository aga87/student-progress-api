import { type RequestHandler } from 'express';
import { studentResultsCommandService } from '../startup/container.js';

export const createStudentResultHandler: RequestHandler = async (req, res) => {
  const { studentId, subject, score } = req.body;

  // TODO: improve validation (out of scope for now)
  if (
    !Number.isInteger(studentId) ||
    studentId <= 0 ||
    typeof subject !== 'string' ||
    subject.trim().length === 0 ||
    !Number.isInteger(score) ||
    score < 0
  ) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }

  await studentResultsCommandService.createResult({
    studentId,
    subject,
    score,
  });

  return res.status(201).json({
    message: 'Student result created',
  });
};
