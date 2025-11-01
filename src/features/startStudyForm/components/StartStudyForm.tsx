import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Box, MultiSelect, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreatableFormItems } from '@/shared/hooks/useCreatableFormItems';
import { FormInputProps } from '@/shared/types/mantine-form-types';
import { TestMode } from '@/shared/types/study-shared-types';
import { useIndividualRangeFormItems } from '../hooks/useIndividualRangeFormItems';
import { STUDY_TIME_BUTTON_CONFIGS } from '../shared/constants/study-time-buttons-config';
import { IndividualRangeFormValue } from '../shared/shared-test-range-types';
import { StudyTimeForm } from './studyTimeForm/StudyTimeForm';
import { TestModeForm } from './testModeForm/TestModeForm';
import { TestRangeForm } from './testRangeForm/TestRangeForm';
import { TestTimeForm } from './testTimeForm/TestTimeForm';
import TagsInputExample from './unitForm/ExampleUsage';
import { UnitForm } from './unitForm/UnitForm';

interface StartStudyFormProps {}

interface FormComponent {
  label: string;
  form: ReactNode;
}

/**
 * フォームの状態の型定義
 */
interface FormValues {
  units: string[];
  studyTimeMin: number | null;
  testMode: TestMode | null;
  testRange: IndividualRangeFormValue[];
  testTimeMin: number;
}

interface CreatableFormItems {
  units: string[];
  categories: string[];
}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({}) => {
  // Mantine Formの設定
  const form = useForm<FormValues>({
    initialValues: {
      units: [],
      studyTimeMin: null,
      testMode: null,
      testRange: [],
      testTimeMin: 15,
    },
    validate: {},
  });

  const { combinedItems, onCreate } = useCreatableFormItems<CreatableFormItems>({
    initialExistingItems: { units: ['unitA', 'unitB'] },
  });

  const formItemsHook = useIndividualRangeFormItems();

  const selectedTimeType = useMemo(() => {
    const config = Object.values(STUDY_TIME_BUTTON_CONFIGS).find(
      (value) => value.timeMin === form.getValues().studyTimeMin
    );

    return config ? config.type : null;
  }, [form]);

  const handleCreateNewUnit = useCallback(
    (unit: string) => {
      onCreate('units', unit);
      if (form.getValues().units.every((item) => (item as string) !== unit)) {
        form.insertListItem('units', unit);
      }
    },
    [form, onCreate]
  );

  const handleCreateNewCategory = useCallback(
    (category: string) => {
      onCreate('categories', category);
    },
    [onCreate]
  );

  const forms: FormComponent[] = useMemo(
    () => [
      {
        label: '単元',
        form: (
          <UnitForm
            {...(form.getInputProps('units') as FormInputProps<string[]>)}
            unitData={combinedItems.units}
            onCreateNewUnit={handleCreateNewUnit}
          />
        ),
      },
      {
        label: '勉強時間',
        form: (
          <StudyTimeForm
            selectedType={selectedTimeType}
            onClick={(config) => form.setFieldValue('studyTimeMin', config.timeMin)}
          />
        ),
      },
      {
        label: 'テストモード',
        form: (
          <TestModeForm
            selectedMode={form.getValues().testMode}
            onClick={(config) => form.setFieldValue('testMode', config.type)}
          />
        ),
      },
      {
        label: 'テスト範囲',
        form: (
          <TestRangeForm
            formItemsHook={formItemsHook}
            units={combinedItems.units?.map((unit) => unit.label) ?? []}
            categories={combinedItems.categories?.map((category) => category.label) ?? []}
            onCreateNewUnit={handleCreateNewUnit}
            onCreateNewCategories={handleCreateNewCategory}
          />
        ),
      },
      {
        label: 'テスト時間',
        form: <TestTimeForm {...(form.getInputProps('testTimeMin') as FormInputProps<number>)} />,
      },
    ],
    [
      form,
      combinedItems,
      formItemsHook,
      selectedTimeType,
      handleCreateNewUnit,
      handleCreateNewCategory,
    ]
  );

  return (
    <div>
      <Stack gap={30}>
        {forms.map((form) => (
          <Stack>
            <Text size="lg" fw={700}>
              {form.label}
            </Text>
            <Box w={'90%'} m={'auto'}>
              {form.form}
            </Box>
          </Stack>
        ))}
      </Stack>
    </div>
  );
};
