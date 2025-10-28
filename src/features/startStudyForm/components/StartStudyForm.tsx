import React from 'react';
import { SelectStudyTimeButton } from './studyTimeForm/SelectStudyTimeButton';
import { SelectStudyTimeForm } from './studyTimeForm/SelectStudyTimeForm';

interface StartStudyFormProps {}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({}) => {
  return (
    <div>
      <SelectStudyTimeForm />
    </div>
  );
};
