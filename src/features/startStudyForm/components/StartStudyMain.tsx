import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Textbook } from '@/shared/data/documents/textbook/textbook-document';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { curdStudyData } from '../shared/form/crud-study-data';
import { convertToLearningCycleClientData } from '../shared/form/form-data-converter';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../shared/form/form-types';
import { processTestData } from '../shared/form/process-form-data';
import { StartStudyForm } from './StartStudyForm';

// UnitとCategoryのマスターデータの型を仮定

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  // 1. 取得したデータを保持するためのstate
  const navigate = useNavigate();

  const textbook: Textbook & { id: string } = {
    id: 'sample-id',
    name: '数学のテキスト',
    subject: 'math',
    units: [{ name: 'unitA', id: 'unitA ID' }],
    categories: [],
  };

  curdStudyData();

  const handleSubmit = async (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => {
    const data = convertToLearningCycleClientData(value, textbook.id);
    const textData = processTestData(
      value.testRange,
      textbook.units,
      textbook.categories,
      0,
      'number',
      () => (Date.now() + Math.random()).toString()
    );

    console.log(data);
    console.log(textData);

    // const data = createEmptyLearningCycle('eng-textbook-002', value);
    // const { units, categories } = getLabelList(creations);
    // await runLearningCycleScenario(data, units, categories);
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
