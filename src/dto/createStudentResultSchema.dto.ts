import Joi from 'joi';
import { SUBJECTS, CreateStudentResultDto } from './createStudentResult.dto.js';

export const createStudentResultSchema = Joi.object<CreateStudentResultDto>({
  studentId: Joi.number().integer().positive().required(),
  subject: Joi.string()
    .valid(...SUBJECTS)
    .required(),
  score: Joi.number().integer().min(0).required(),
});
