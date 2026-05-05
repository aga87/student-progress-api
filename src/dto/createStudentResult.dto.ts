export const SUBJECTS = [
  'Dutch',
  'English',
  'Geography',
  'History',
  'Maths',
] as const;
export type Subject = (typeof SUBJECTS)[number];

export type CreateStudentResultDto = {
  studentId: number;
  subject: Subject;
  score: number;
};
