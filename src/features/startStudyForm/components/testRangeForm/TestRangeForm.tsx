import React from 'react';
import { Flex } from '@mantine/core';
import { TEST_RANGE_BUTTON_CONFIGS } from '../../shared/constants/range-form-config';
import { useTheme } from '../../shared/useTheme';
import { StartStudyFormSelectButton } from '../shared/StartStudyFormSelectButton';
import { IndividualRangeForm } from './individualRangeForm/IndividualRangeForm';

interface TestRangeFormProps {}

export const TestRangeForm: React.FC<TestRangeFormProps> = ({}) => {
  const getTheme = useTheme();

  return (
    <>
      <Flex gap={10} h={100}>
        {Object.values(TEST_RANGE_BUTTON_CONFIGS).map((config) => {
          return (
            <StartStudyFormSelectButton
              key={config.type}
              {...config}
              theme={getTheme(config.themeColor)}
              onClick={() => {}}
            />
          );
        })}
      </Flex>
      <IndividualRangeForm />
    </>
  );
};
