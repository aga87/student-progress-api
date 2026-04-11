import { type Pool, type RowDataPacket } from 'mysql2/promise';

export type StudentResult = {
  studentId: number;
  studentName: string;
  subject: string;
  score: number;
};

type StudentResultRowDb = StudentResult & RowDataPacket;

export type CreateStudentResult = {
  studentId: number;
  subject: string;
  score: number;
};

export class StudentResultsRepository {
  private db?: Pool;
  private readonly dbConnectionFn: () => Pool;

  private readonly baseQuery = `
    SELECT
      s.id AS studentId,
      s.name AS studentName,
      r.subject AS subject,
      r.score AS score
    FROM students s
    INNER JOIN results r
      ON r.student_id = s.id
  `;

  public constructor(dbConnectionFn: () => Pool) {
    this.dbConnectionFn = dbConnectionFn;
  }

  public async getAll(): Promise<StudentResult[]> {
    const query = `
      ${this.baseQuery}
      ORDER BY s.name ASC, r.subject ASC;
    `;

    const [rows] = await this.getDB().query<StudentResultRowDb[]>(query);

    return rows.map(row => this.mapRow(row));
  }

  public async getByStudentId(studentId: number): Promise<StudentResult[]> {
    const query = `
      ${this.baseQuery}
      WHERE s.id = ?
      ORDER BY r.subject ASC;
    `;

    const [rows] = await this.getDB().query<StudentResultRowDb[]>(query, [
      studentId,
    ]);

    return rows.map(row => this.mapRow(row));
  }

  public async create(input: CreateStudentResult): Promise<void> {
    const query = `
    INSERT INTO results (
      student_id,
      subject,
      score
    )
    VALUES (?, ?, ?);
  `;

    await this.getDB().execute(query, [
      input.studentId,
      input.subject,
      input.score,
    ]);
  }

  private getDB(): Pool {
    if (!this.db) {
      this.db = this.dbConnectionFn();
    }

    return this.db;
  }

  private mapRow(row: StudentResultRowDb): StudentResult {
    return {
      studentId: row.studentId,
      studentName: row.studentName,
      subject: row.subject,
      score: row.score,
    };
  }
}
