import { GroupReviewNecessityResult, ReviewNecessityResult } from '../types/review-necessity-types';

export const calculateGroupReviewNecessity = (
  sortedResults: ReviewNecessityResult[]
): GroupReviewNecessityResult => {
  const recentResults = sortedResults.slice(-2);
  const isR0Wrong = recentResults[1].level > 1;
  const isR1Wrong = recentResults[0].level > 1;

  if (isR0Wrong && isR1Wrong) {
    return {
      reason: 'consecutiveMistakes',
      level: 3,
      alternativeLevel: 3,
      isGroup: true,
      isUnrated: false,
    };
  }
  if (isR0Wrong) {
    return {
      reason: 'failedLatestAttempt',
      level: 2,
      alternativeLevel: 2,
      isGroup: true,
      isUnrated: false,
    };
  }
  if (isR1Wrong) {
    return {
      reason: 'failedSecondToLastAttempt',
      level: 1,
      alternativeLevel: 1,
      isGroup: true,
      isUnrated: false,
    };
  }
  if (!recentResults[0].isUnrated && !recentResults[1].isUnrated) {
    return {
      reason: 'consecutiveCorrect',
      level: 0,
      alternativeLevel: 0,
      isGroup: true,
      isUnrated: false,
    };
  }
  return {
    reason: 'insufficientRatedAttempts',
    level: -1,
    alternativeLevel: 0,
    isGroup: true,
    isUnrated: true,
  };
};
