import React from 'react';
import { Button, Flex } from '@mantine/core';
import { useSelfEvaluationColors } from '@/features/study/hooks/useSelfEvaluationColors';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { sharedStyle } from '@/shared/styles/shared-styles';

interface TestSelfEvaluationButtonsProps {
  selectedSelfEvaluation: TestSelfEvaluation;
  selfEvaluations: TestSelfEvaluation[];
  onSelectSelfEvaluation: (evaluation: TestSelfEvaluation) => void;
}

export const TestSelfEvaluationButtons: React.FC<TestSelfEvaluationButtonsProps> = ({
  selectedSelfEvaluation,
  selfEvaluations,
  onSelectSelfEvaluation,
}) => {
  const getColor = useSelfEvaluationColors();
  return (
    <Flex gap={5}>
      {selfEvaluations.map((key) => {
        const isActive = selectedSelfEvaluation === 'unrated' || key === selectedSelfEvaluation;
        const targetConfig = getColor(key);

        const config = isActive
          ? targetConfig
          : {
              ...getColor('unrated'),
              type: targetConfig.type,
              label: targetConfig.label,
            };

        return (
          <Button
            key={key}
            style={{
              ...sharedStyle.button,
              color: config.text,
              backgroundColor: config.background,
              border: `2px solid ${config.border}`,
            }}
            onClick={() => onSelectSelfEvaluation(config.type)}
          >
            {config.label}
          </Button>
        );
      })}
    </Flex>
  );
};
