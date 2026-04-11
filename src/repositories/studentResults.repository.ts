import { type Pool, type RowDataPacket } from 'mysql2/promise';

export type StudentResult = {
  studentId: number;
  studentName: string;
  subject: string;
  score: number;
};

type StudentResultRowDb = StudentResult & RowDataPacket;

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

  public async getAll(): Promise<StudentResult[]> {
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
      subject: row.subject,
      score: row.score,
    }));
  }
}
