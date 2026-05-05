import { type RequestHandler } from 'express';
import { studentResultsCommandService } from '../startup/container.js';
import { validateSchema } from '../libs/joiValidator.js';
import { createStudentResultSchema } from '../dto/createStudentResultSchema.dto.js';

export const createStudentResultHandler: RequestHandler = async (req, res) => {
  const result = validateSchema(req.body, createStudentResultSchema);

  if (!result.success) {
    return res.status(400).json({
      message: 'Invalid request body',

      errors: result.errors,
    });
  }

  const { studentId, subject, score } = result.data;

  await studentResultsCommandService.createResult({
    studentId,
    subject,
    score,
  });

  return res.status(201).json({
    message: 'Student result created',
  });
};
