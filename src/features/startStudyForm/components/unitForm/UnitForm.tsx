import React from 'react';
import { ComboboxItem, MultiSelect, TagsInput } from '@mantine/core';
import { CustomCreatableTagsInput } from '@/shared/components/CustomCreatableTagsInput';
import { CreatableCombobox } from './CreatableCombobox';

interface UnitFormProps {
  unitData: { value: string; label: string }[] | string[];
  value: string[];
  error?: React.ReactNode;
  onChange: (value: string[]) => void;
  onCreateNewUnit: (query: string) => void;
}

export const UnitForm: React.FC<UnitFormProps> = ({
  unitData,
  value,
  error,
  onChange,
  onCreateNewUnit,
}) => {
  return (
    <div>
      <CustomCreatableTagsInput
        data={unitData}
        // 外部の状態から値を渡す
        value={value}
        error={error}
        // 値が変更されたときに外部の状態を更新する
        shouldCloseOnOptionSubmit
        onChange={onChange}
        onCreate={onCreateNewUnit}
      />
    </div>
  );
};
