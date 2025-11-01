import React, { ReactNode, useMemo, useState } from 'react';
import { MultiSelect, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FormInputProps } from '@/shared/types/mantine-form-types';
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
}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({}) => {
  // Mantine Formの設定
  const form = useForm<FormValues>({
    initialValues: {
      units: [],
    },
    validate: {},
  });

  const forms: FormComponent[] = useMemo(
    () => [
      {
        label: '単元',
        form: (
          <TagsInputExample
          // {...(form.getInputProps('units') as FormInputProps<string[]>)}
          // unitData={[]}
          // onCreateNewUnit={(unit) => console.log(unit)}
          />
        ),
      },
      {
        label: '単元',
        form: (
          <UnitForm
            {...(form.getInputProps('units') as FormInputProps<string[]>)}
            unitData={['a', 'vada', 'bawkdoa']}
            onCreateNewUnit={(unit) => console.log(unit)}
          />
        ),
      },
      {
        label: '勉強時間',
        form: <StudyTimeForm selectedType={'balance'} onClick={(type) => console.log(type)} />,
      },
      {
        label: 'テストモード',
        form: <TestModeForm selectedMode={null} onClick={(type) => console.log(type)} />,
      },
      // { label: 'テスト範囲', form: <TestRangeForm /> },
      // { label: 'テスト時間', form: <TestTimeForm /> },
    ],
    []
  );

  const data = [
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue' },
    // ... 他のオプション
  ];

  return (
    <div>
      <Stack>
        {forms.map((form) => (
          <Stack>
            <Text>{form.label}</Text>
            {form.form}
          </Stack>
        ))}
      </Stack>

      <MultiSelect
        data={data}
        label="好きなライブラリを選択"
        placeholder="検索して選択"
        searchable
      />
    </div>
  );
};
