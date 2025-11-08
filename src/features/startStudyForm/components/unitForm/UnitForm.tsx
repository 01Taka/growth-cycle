import React from 'react';
import { CustomCreatableTagsInput } from '@/shared/components/CustomCreatableTagsInput';

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
        value={value}
        error={error}
        shouldCloseOnOptionSubmit
        onChange={onChange}
        onCreate={onCreateNewUnit}
      />
    </div>
  );
};
