import { type StudentResultsRepository } from '../repositories/studentResults.repository.js';
import { type StudentResults } from '../repositories/studentResults.repository.js';

export class StudentResultsService {
  constructor(private readonly studentRepository: StudentResultsRepository) {}

  public async listStudentResults(): Promise<StudentResults[]> {
    return this.studentRepository.getStudentResults();
  }
}
