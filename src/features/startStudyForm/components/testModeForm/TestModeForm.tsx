import React from 'react';
import { Flex } from '@mantine/core';
import { TestMode } from '@/shared/types/study-shared-types';
import { TEST_MODE_BUTTON_CONFIGS } from '../../shared/constants/test-mode-form-config';
import { TestModeSelectButtonConfig } from '../../shared/shared-props-types';
import { useTheme } from '../../shared/useTheme';
import { StartStudyFormSelectButton } from '../shared/StartStudyFormSelectButton';

interface TestModeFormProps {
  selectedMode: TestMode | null;
  onClick: (config: TestModeSelectButtonConfig, disabled: boolean) => void;
}

export const TestModeForm: React.FC<TestModeFormProps> = ({ selectedMode, onClick }) => {
  const getTheme = useTheme();

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
