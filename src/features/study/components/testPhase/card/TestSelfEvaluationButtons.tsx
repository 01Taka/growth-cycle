import React from 'react';
import { Button, Flex } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SELF_EVALUATIONS_CONFIGS } from '../../../constants/self-evaluations-configs';

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
  return (
    <Flex gap={5}>
      {selfEvaluations.map((key) => {
        const isActive = selectedSelfEvaluation === 'unrated' || key === selectedSelfEvaluation;
        const targetConfig = SELF_EVALUATIONS_CONFIGS[key];

        const config = isActive
          ? targetConfig
          : {
              ...SELF_EVALUATIONS_CONFIGS['unrated'],
              type: targetConfig.type,
              text: targetConfig.text,
            };

        return (
          <Button
            key={key}
            style={{
              ...sharedStyle.button,
              color: config.color,
              backgroundColor: config.bgColor,
              border: `2px solid ${config.borderColor}`,
            }}
            onClick={() => onSelectSelfEvaluation(config.type)}
          >
            {config.text}
          </Button>
        );
      })}
    </Flex>
  );
};
