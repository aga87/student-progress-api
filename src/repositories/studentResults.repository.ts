import { type Pool, type RowDataPacket } from 'mysql2/promise';

export type StudentResults = {
  studentId: number;
  studentName: string;
  resultId: number;
  subject: string;
  score: number;
};

type StudentResultRowDb = StudentResults & RowDataPacket;

export class StudentResultsRepository {
  private db?: Pool;
  private readonly dbConnectionFn: () => Pool;

  constructor(dbConnectionFn: () => Pool) {
    this.dbConnectionFn = dbConnectionFn;
  }

  private getDB(): Pool {
    if (!this.db) {
      this.db = this.dbConnectionFn();
    }

    return this.db;
  }

  public async getStudentResults(): Promise<StudentResults[]> {
    const query = `
      SELECT
        s.id AS studentId,
        s.name AS studentName,
        r.id AS resultId,
        r.subject AS subject,
        r.score AS score
      FROM students s
      INNER JOIN results r
        ON r.student_id = s.id
      ORDER BY s.name ASC, r.subject ASC;
    `;

    const [rows] = await this.getDB().query<StudentResultRowDb[]>(query);

    return rows.map(row => ({
      studentId: row.studentId,
      studentName: row.studentName,
      resultId: row.resultId,
      subject: row.subject,
      score: row.score,
    }));
  }
}
