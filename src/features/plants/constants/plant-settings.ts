import { PlantSetting } from '../types/plant-types';

// PlantTypeごとのモジュール抽選設定
export const PLANT_SETTINGS: Record<string, PlantSetting> = {
  // PlantKeyは'MATH_ROSEA'
  MATH_ROSEA: {
    modules: {
      stem: {
        Thick_V1: { moduleRarity: 'R', weight: 50 },
        Thin_V2: { moduleRarity: 'R', weight: 30 },
      },
      flower: {
        Spike_SR: { moduleRarity: 'SR', weight: 20 },
        Petal_R: { moduleRarity: 'R', weight: 50 },
      },
      leaf: {
        // デフォルトの葉っぱは必ず出る想定
        Round_V2: { moduleRarity: 'R', weight: 100 },
      },
    },
  },
};
