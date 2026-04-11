import { type StudentResultsRepository } from '../repositories/studentResults.repository.js';

export type StudentWithResults = {
  studentId: number;
  studentName: string;
  results: Array<{
    subject: string;
    score: number;
  }>;
};

export class StudentResultsService {
  public constructor(
    private readonly studentRepository: StudentResultsRepository
  ) {}

  public async getAll(): Promise<StudentWithResults[]> {
    const rows = await this.studentRepository.getAll();

    const studentsMap = new Map<number, StudentWithResults>();

    for (const row of rows) {
      const existingStudent = studentsMap.get(row.studentId);

      if (existingStudent) {
        existingStudent.results.push({
          subject: row.subject,
          score: row.score,
        });

        continue;
      }

      studentsMap.set(row.studentId, {
        studentId: row.studentId,
        studentName: row.studentName,
        results: [
          {
            subject: row.subject,
            score: row.score,
          },
        ],
      });
    }

    return Array.from(studentsMap.values());
  }

  public async getByStudentId(
    studentId: number
  ): Promise<StudentWithResults | null> {
    const rows = await this.studentRepository.getByStudentId(studentId);

    if (rows.length === 0) {
      return null;
    }

    const firstRow = rows[0];

    return {
      studentId: firstRow.studentId,
      studentName: firstRow.studentName,
      results: rows.map(row => ({
        subject: row.subject,
        score: row.score,
      })),
    };
  }
}
