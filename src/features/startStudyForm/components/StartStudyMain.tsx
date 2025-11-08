import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Creations } from '@/shared/types/creatable-form-items-types';
import {
  getAllCategoryMasterData,
  getAllUnitMasterData,
} from '../functions/createLearningCycleInPseudoServer';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../types/form-types';
import { StartStudyForm } from './StartStudyForm';

// UnitとCategoryのマスターデータの型を仮定

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  // 1. 取得したデータを保持するためのstate
  const navigate = useNavigate();
  const [existUnits, setExistUnits] = useState<string[]>([]);
  const [existCategories, setExistCategories] = useState<string[]>([]);

  // 2. useEffectを使ってコンポーネントマウント時にデータを取得
  useEffect(() => {
    // useEffectのコールバック関数自体はasyncにできないため、内部で非同期関数を定義し即時実行
    const fetchMasterData = async () => {
      try {
        const unitsData = await getAllUnitMasterData('user_low_study');
        const categoriesData = await getAllCategoryMasterData('user_low_study');

        // 3. stateを更新
        setExistUnits(unitsData.map((data) => data.name));
        setExistCategories(categoriesData.map((data) => data.name));
      } catch (error) {
        console.error('マスターデータの取得中にエラーが発生しました:', error);
        // エラーハンドリング（必要に応じてエラー状態をセットするなど）
      }
    };

    fetchMasterData();
    // 依存配列を空（[]）にすることで、コンポーネントのマウント時（初回レンダリング後）に一度だけ実行される
  }, []);

  // --- 既存のロジック ---
  const getLabelList = (creations: Creations<StartStudyFormCreatableItems>) => {
    return {
      units: creations.units ? Object.values(creations.units).map((unit) => unit.label) : [],
      categories: creations.categories
        ? Object.values(creations.categories).map((category) => category.label)
        : [],
    };
  };

  const handleSubmit = async (
    value: StartStudyFormValues,
    creations: Creations<StartStudyFormCreatableItems>
  ) => {
    // const data = createEmptyLearningCycle('eng-textbook-002', value);
    // const { units, categories } = getLabelList(creations);
    // await runLearningCycleScenario(data, units, categories);
    navigate('/study');
  };

  // 4. stateに保持したデータをpropsとして渡す
  return (
    <div>
      <StartStudyForm
        existUnits={existUnits}
        existCategories={existCategories}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
