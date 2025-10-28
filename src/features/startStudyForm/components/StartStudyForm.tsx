import React from 'react';
import { StudyTimeForm } from './studyTimeForm/StudyTimeForm';
import { TestModeForm } from './testModeForm/TestModeForm';
import { TestRangeForm } from './testRangeForm/TestRangeForm';
import { UnitForm } from './unitForm/UnitForm';

interface StartStudyFormProps {}

export const StartStudyForm: React.FC<StartStudyFormProps> = ({}) => {
  return (
    <div>
      <UnitForm />
      <StudyTimeForm selectedType={'balance'} onClick={(type) => console.log(type)} />
      <TestModeForm selectedMode={null} onClick={(type) => console.log(type)} />
      <TestRangeForm />
    </div>
  );
};
