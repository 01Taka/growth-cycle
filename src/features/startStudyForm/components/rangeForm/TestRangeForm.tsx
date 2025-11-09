import React from 'react';
import { Button, ComboboxItem, Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { RangeFormCard } from './RangeFormCard';
import { useRangeFormCardsManager } from './useRangeFormCard';

interface TestRangeFormProps {
  form: UseFormReturnType<any>;
  unitData: ComboboxItem[] | string[];
  categoryData: ComboboxItem[] | string[];
  onCreateUnit: (name: string) => void;
  onCreateCategory: (name: string) => void;
}

export const TestRangeForm: React.FC<TestRangeFormProps> = ({
  form,
  unitData,
  categoryData,
  onCreateUnit,
  onCreateCategory,
}) => {
  const manager = useRangeFormCardsManager(form, 'testRange');

  return (
    <Stack gap={'md'}>
      {manager.getAllCardProps().map((args, index) => (
        <RangeFormCard
          key={index}
          unitHandler={{
            data: unitData,
            onCreate: (value) => {
              onCreateUnit(value);
              args.unitForm.onChange(value);
            },
          }}
          categoryHandler={{
            data: categoryData,
            onCreate: (value) => {
              onCreateCategory(value);
              args.categoryForm.onChange(value);
            },
          }}
          {...args}
        />
      ))}
      <Button
        style={{ backgroundColor: '#eae497', color: '#5f5f00' }}
        onClick={() => manager.addCard()}
        size="md"
        radius={'md'}
      >
        範囲を追加 +
      </Button>
    </Stack>
  );
};
