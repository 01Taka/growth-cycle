import React from 'react';
import { Textbook } from '@/shared/data/documents/textbook-types';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { createEmptyLearningCycle } from '../functions/create-learning-cycle';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../types/form-types';
import { StartStudyForm } from './StartStudyForm';

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  const dummyTextbook: Textbook = {
    id: 'dummy-id',
    name: '化学のセミナー',
    subject: 'science',
  };

  const handleSubmit = (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => {
    const data = createEmptyLearningCycle(dummyTextbook, value, creations);
    console.log(data);
  };

  return (
    <div>
      <StartStudyForm
        existUnits={['UnitA', 'UnitB']}
        existCategories={['CategoryA', 'CategoryB']}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
