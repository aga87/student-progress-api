import {
  type StudentResultsRepository,
  type CreateStudentResult,
} from '../repositories/studentResults.repository.js';
import { type StudentResultsCacheRepository } from '../repositories/studentResultsCache.repository.js';
import { debugLog } from '../logging/debug.js';

export class StudentResultsCommandService {
  public constructor(
    private readonly studentRepository: StudentResultsRepository,
    private readonly studentResultsCacheRepository: StudentResultsCacheRepository
  ) {}

  public async createResult(input: CreateStudentResult): Promise<void> {
    await this.studentRepository.create(input);

    debugLog(`Created student result [studentId=${input.studentId}]`);

    await this.studentResultsCacheRepository.delete(input.studentId);

    debugLog(
      `Invalidated student results cache [studentId=${input.studentId}]`
    );
  }
}
