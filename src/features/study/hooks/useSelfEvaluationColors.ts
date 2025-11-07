import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SELF_EVALUATION_COLORS } from '../constants/self-evaluations-configs';

export interface SelfEvaluationConfig {
  type: TestSelfEvaluation;
  label: string;
  text: string;
  background: string;
  border: string;
}

export const useSelfEvaluationColors = (): ((
  evaluation: TestSelfEvaluation
) => SelfEvaluationConfig) => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  return (evaluation: TestSelfEvaluation) => ({
    type: evaluation,
    label: SELF_EVALUATION_COLORS[evaluation].label,
    ...SELF_EVALUATION_COLORS[evaluation][colorScheme],
  });
};
