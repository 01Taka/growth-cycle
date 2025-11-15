import { DifferenceGrade } from '../types/learning-history-types';

export const differenceColorGrades: DifferenceGrade[] = [
  { grade: 1, maxDifferenceDays: 1, color: 'red', description: '見直し' },
  { grade: 2, maxDifferenceDays: 4, color: 'yellow', description: '直前' },
  { grade: 3, maxDifferenceDays: 12, color: 'yellow', description: 'すぐ' },
  { grade: 4, maxDifferenceDays: 30, color: 'lime', description: 'まだ' },
  { grade: 5, maxDifferenceDays: Infinity, color: 'green', description: '余裕' },
];

export const ratioBorders = [
  // 0.0 <= ratio < 0.3 => Grade 1
  { border: 0.0, grade: 1 }, // 0.3 <= ratio < 0.5 => Grade 2
  { border: 0.1, grade: 2 }, // 0.5 <= ratio < 0.7 => Grade 3
  { border: 0.2, grade: 3 }, // 0.7 <= ratio < 0.9 => Grade 4
  { border: 0.5, grade: 4 }, // 0.9 <= ratio <= 1.0 => Grade 5
  { border: 0.9, grade: 5 },
];
