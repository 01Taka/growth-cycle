import React from 'react';
import { Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { RangeFormCard } from './RangeFormCard';
import { useRangeFormCardsManager } from './useRangeFormCard';

interface TestRangeFormProps {
  form: UseFormReturnType<any>;
}

export const TestRangeForm: React.FC<TestRangeFormProps> = ({ form }) => {
  const manager = useRangeFormCardsManager(form, 'ranges');

  return (
    <Stack gap={'md'}>
      {manager.getAllCardProps().map((args) => (
        <RangeFormCard
          unitHandler={{
            data: ['unitA', 'unitB'],
            onCreate: (value) => {
              args.unitForm.onChange(value);
            },
          }}
          categoryHandler={{
            data: [],
            onCreate: (value) => {
              args.categoryForm.onChange(value);
            },
          }}
          {...args}
        />
      ))}
    </Stack>
  );
};
