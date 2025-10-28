import React from 'react';
import { MantineColorScheme, Stack } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { getStudyTimeButtonsProps } from '../../shared/study-time-buttons-config';
import { SelectStudyTimeButton } from './SelectStudyTimeButton';

interface SelectStudyTimeFormProps {}

export const SelectStudyTimeForm: React.FC<SelectStudyTimeFormProps> = ({}) => {
  const colorScheme = useColorScheme();

  const items = getStudyTimeButtonsProps('light');

  return (
    <Stack gap={8}>
      {items.map((item) => (
        <SelectStudyTimeButton {...item(false)} />
      ))}
    </Stack>
  );
};
