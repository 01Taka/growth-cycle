import React from 'react';
import { Flex } from '@mantine/core';
import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TEST_MODE_BUTTON_CONFIGS } from '../../shared/components-constants/test-mode-form-config';
import { TestModeSelectButtonConfig } from '../../shared/components-types/shared-props-types';
import { StartStudyFormSelectButton } from '../../shared/StartStudyFormSelectButton';
import { useStudyFormTheme } from '../../shared/useStudyFormTheme';

interface TestModeFormProps {
  selectedMode: TestMode | null;
  onClick: (config: TestModeSelectButtonConfig, disabled: boolean) => void;
}

export const TestModeForm: React.FC<TestModeFormProps> = ({ selectedMode, onClick }) => {
  const getTheme = useStudyFormTheme();

  return (
    <Flex gap={10} h={140}>
      {Object.values(TEST_MODE_BUTTON_CONFIGS).map((config) => {
        const disabled = selectedMode !== null && selectedMode !== config.type;
        return (
          <StartStudyFormSelectButton
            key={config.type}
            {...config}
            theme={getTheme(disabled ? 'disabled' : config.themeColor)}
            disabled={disabled}
            onClick={() => onClick(config, disabled)}
          />
        );
      })}
    </Flex>
  );
};
