import { DifferenceGrade } from '../types/learning-history-types';

export const differenceColorGrades: DifferenceGrade[] = [
  { grade: 1, maxDifferenceDays: 1, color: 'red', description: '見直し' },
  { grade: 2, maxDifferenceDays: 7, color: 'orange', description: '直前' },
  { grade: 3, maxDifferenceDays: 15, color: 'yellow', description: 'すぐ' },
  { grade: 4, maxDifferenceDays: 30, color: 'lime', description: 'まだ' },
  { grade: 5, maxDifferenceDays: Infinity, color: 'green', description: '余裕' },
];
