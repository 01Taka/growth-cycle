import React, { useCallback, useMemo } from 'react';
import { Box, Button, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreatableFormItems } from '@/shared/hooks/useCreatableFormItems';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { FormInputProps } from '@/shared/types/mantine-form-types';
import { STUDY_TIME_BUTTON_CONFIGS } from '../shared/constants/study-time-buttons-config';
import {
  StartStudyFormComponent,
  StartStudyFormCreatableItems,
  StartStudyFormValues,
} from '../types/form-types';
import { TestRangeForm } from './rangeForm/TestRangeForm';
import { StudyTimeForm } from './studyTimeForm/StudyTimeForm';
import { TestModeForm } from './testModeForm/TestModeForm';
import { TestTimeForm } from './testTimeForm/TestTimeForm';
import { UnitForm } from './unitForm/UnitForm';

interface StartStudyFormProps {
  existUnits: string[];
  existCategories: string[];
  handleSubmit: (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => void;
}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({
  existUnits,
  existCategories,
  handleSubmit,
}) => {
  const form = useForm<StartStudyFormValues>({
    initialValues: {
      units: [],
      studyTimeMin: null,
      testMode: null,
      testRange: [],
      testTimeMin: 15,
    },
    validate: {
      units: (value) => (value.length < 1 ? '単元を1つ以上選択してください' : null), // 配列の長さが1以上が必須
      studyTimeMin: (value) => (value === null ? '勉強時間を選択してください' : null), // nullは埋められている必要あり
      testMode: (value) => (value === null ? 'テストモードを選択してください' : null), // nullは埋められている必要あり
      // testRange: 上書きするので省略,
      testTimeMin: (value) => (value === null ? 'テスト時間を入力してください' : null), // nullは埋められている必要あり
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
      // setFieldValue を使用して、既存の配列に新しいユニットを追加
      if (!form.values.units.includes(unit)) {
        form.setFieldValue('units', [...form.values.units, unit]);
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

  const forms: StartStudyFormComponent[] = useMemo(
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
            selectedMode={form.values.testMode} // form.values を直接参照
            onClick={(config) => form.setFieldValue('testMode', config.type)}
          />
        ),
      },
      {
        label: 'テスト範囲',
        form: <TestRangeForm form={form} />,
      },
      {
        label: 'テスト時間',
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
      <Stack gap={30}>
        {forms.map((item) => (
          <Stack key={item.label}>
            {' '}
            {/* keyを追加 */}
            <Text size="lg" fw={700}>
              {item.label}
            </Text>
            <Box w={'90%'} m={'auto'}>
              {item.form}
            </Box>
          </Stack>
        ))}
        <Button type="submit">学習開始</Button>
      </Stack>
    </Box>
  );
};
