import { REVIEW_NECESSITY_REASON_LABELS } from '../constants/review-necessity-constants';
import { determineFinalReviewNecessity } from '../functions/calculate-review-necessity';
import { AttemptLog, ReviewNecessityResult } from '../types/problem-types';
import { useReviewNecessityColors } from './useReviewNecessityColors';

export const useReviewNecessity = (logs: (AttemptLog | null)[]): ReviewNecessityResult => {
  const scores = determineFinalReviewNecessity(logs);
  const theme = useReviewNecessityColors(scores);
  return {
    reviewNecessity: {
      level: scores.reviewNecessity,
      theme: theme.reviewNecessity,
      label: theme.reviewNecessity.label,
    },
    latestAttemptNecessity: {
      ...scores.latestAttemptNecessity,
      theme: theme.latestAttemptNecessity,
      label: theme.latestAttemptNecessity.label,
      reasonLabel: REVIEW_NECESSITY_REASON_LABELS[scores.latestAttemptNecessity.reason],
    },
    recentWeightedNecessity: {
      ...scores.recentWeightedNecessity,
      theme: theme.recentWeightedNecessity,
      label: theme.recentWeightedNecessity.label,
      reasonLabel: REVIEW_NECESSITY_REASON_LABELS[scores.recentWeightedNecessity.reason],
    },
    getNecessityColor: theme.getNecessityColor,
  };
};
