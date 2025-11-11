import React, { useCallback, useMemo } from 'react';
import { Box, Button, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreatableFormItems } from '@/shared/hooks/useCreatableFormItems';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { FormInputProps } from '@/shared/types/mantine-form-types';
import { STUDY_TIME_BUTTON_CONFIGS } from '../shared/components-constants/study-time-buttons-config';
import {
  StartStudyFormComponent,
  StartStudyFormCreatableItems,
  StartStudyFormValues,
} from '../shared/form/form-types';
import { TestRangeForm } from './rangeForm/TestRangeForm';
import { StudyTimeForm } from './studyTimeForm/StudyTimeForm';
import { TestModeForm } from './testModeForm/TestModeForm';
import { TestTimeForm } from './testTimeForm/TestTimeForm';

interface StartStudyFormProps {
  existUnits: string[];
  existCategories: string[];
  handleSubmit: (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => void;
  theme: SubjectColorMap;
}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({
  theme,
  existUnits,
  existCategories,
  handleSubmit,
}) => {
  const form = useForm<StartStudyFormValues>({
    initialValues: {
      studyTimeMin: null,
      testMode: null,
      testRange: [{ unitName: '', categoryName: '', ranges: [] }],
      testTimeMin: 15,
    },
    validate: {
      studyTimeMin: (value) => (value === null ? '勉強時間を選択してください' : null),
      testMode: (value) => (value === null ? 'テストモードを選択してください' : null),
      testRange: (value) => {
        const validRanges = value.filter(
          (range) => !!range.categoryName && !!range.unitName && range.ranges.length > 0
        );
        return validRanges.length > 0 ? null : '範囲を入力してください';
      },
      testTimeMin: (value) => (value === null ? 'テスト時間を入力してください' : null),
    },
  });

  const { creations, combinedItems, onCreate } =
    useCreatableFormItems<StartStudyFormCreatableItems>({
      initialExistingItems: { units: existUnits, categories: existCategories },
    });

  // 依存配列を form.values.studyTimeMin に限定
  const selectedTimeType = useMemo(() => {
    const config = Object.values(STUDY_TIME_BUTTON_CONFIGS).find(
      (value) => value.timeMin === form.values.studyTimeMin // form.values を直接参照
    );
    return config ? config.type : null;
  }, [form.values.studyTimeMin]); // 依存配列に特定の値のみを使用

  const handleCreateNewUnit = useCallback(
    (unit: string) => {
      onCreate('units', unit);
    },
    [form, onCreate]
  );

  const handleCreateNewCategory = useCallback(
    (category: string) => {
      onCreate('categories', category);
    },
    [onCreate]
  );

  const isFormValid = useMemo(() => {
    const validationResult = form.validate();
    return Object.keys(validationResult.errors).length === 0;
  }, [form.values]);

  const forms: StartStudyFormComponent[] = useMemo(
    () => [
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
            selectedMode={form.values.testMode} // form.values を直接参照
            onClick={(config) => form.setFieldValue('testMode', config.type)}
          />
        ),
      },
      {
        label: 'テスト範囲',
        form: (
          <TestRangeForm
            form={form}
            unitData={combinedItems.units}
            categoryData={combinedItems.categories}
            onCreateUnit={handleCreateNewUnit}
            onCreateCategory={handleCreateNewCategory}
          />
        ),
      },
      {
        label: 'テスト時間(分)',
        form: <TestTimeForm {...(form.getInputProps('testTimeMin') as FormInputProps<number>)} />,
      },
    ],
    [
      form, // form のメソッド（getInputProps, setFieldValueなど）のために残す
      combinedItems,
      selectedTimeType,
      handleCreateNewUnit,
      handleCreateNewCategory,
    ]
  );

  return (
    // フォーム送信機能を有効化
    <Box
      component="form"
      onSubmit={form.onSubmit((data) => {
        handleSubmit({ ...data }, creations);
      })}
    >
      <Stack gap={30} mb={120}>
        {forms.map((item) => (
          <Stack key={item.label}>
            {/* keyを追加 */}
            <Text size="lg" fw={700}>
              {item.label}
            </Text>
            <Box w={'90%'} m={'auto'}>
              {item.form}
            </Box>
          </Stack>
        ))}
      </Stack>
      <Button
        type="submit"
        size="lg"
        bg={isFormValid ? theme.accent : theme.disabled}
        color={isFormValid ? theme.text : theme.disabledText}
        style={{
          borderRadius: sharedStyle.button.borderRadius,
          position: 'fixed',
          bottom: 5,
          right: 5,
          left: 5,
          zIndex: 1000,
        }}
        disabled={!isFormValid}
      >
        学習開始
      </Button>
    </Box>
  );
};
