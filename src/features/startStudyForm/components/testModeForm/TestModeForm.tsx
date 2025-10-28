import React from 'react';
import { Flex } from '@mantine/core';
import { TestMode } from '@/shared/types/study-shared-types';
import { useTheme } from '../../shared/useTheme';
import { testModeButtonsConfig } from './test-mode-form-config';
import { TestModeSelectButton } from './TestModeSelectButton';

interface TestModeFormProps {
  selectedMode: TestMode | null;
}

export const TestModeForm: React.FC<TestModeFormProps> = ({ selectedMode }) => {
  const getTheme = useTheme();

  return (
    <Flex gap={10}>
      {Object.values(testModeButtonsConfig).map((config) => (
        <TestModeSelectButton
          {...config}
          theme={getTheme(
            selectedMode === null || selectedMode === config.type ? config.themeColor : 'disabled'
          )}
        />
      ))}
    </Flex>
  );
};
