import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { curdStudyData } from '../shared/form/crud-study-data';
import { convertToLearningCycleClientData } from '../shared/form/form-data-converter';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../shared/form/form-types';
import { processProblemMetadata } from '../shared/form/process-form-data';
import { StartStudyForm } from './StartStudyForm';

// UnitとCategoryのマスターデータの型を仮定

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  // 1. 取得したデータを保持するためのstate
  const navigate = useNavigate();

  const textbook: TextbookDocument = {
    id: 'sample-id',
    path: 'sample-path',
    name: '数学のテキスト',
    subject: 'math',
    units: [{ name: 'unitA', id: 'unitA ID' }],
    categories: [],
  };

  const handleSubmit = async (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => {
    try {
      const data = convertToLearningCycleClientData(value, textbook.id);
      if (!data) {
        throw new Error('');
      }

      const problemMeta = processProblemMetadata(
        value.testRange,
        textbook.units,
        textbook.categories,
        0,
        'number',
        () => (Date.now() + Math.random()).toString()
      );

      await curdStudyData(data, problemMeta, '2025-11-10');

      console.log(data);
      console.log(problemMeta);
    } catch (error) {
      console.error(error);
    }

    // navigate('/study');
  };

  // 4. stateに保持したデータをpropsとして渡す
  return (
    <div>
      <StartStudyForm
        textbookName={textbook.name}
        subject={textbook.subject}
        existUnits={textbook.units.map((unit) => unit.name)}
        existCategories={textbook.categories.map((category) => category.name)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
