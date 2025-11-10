import { SeedSetting } from '../types/plant-types';

// SeedTypeごとの植物抽選設定
export const SEED_SETTINGS: Record<string, SeedSetting> = {
  math: {
    plants: {
      RoseA: { minSize: 100, maxSize: 120, rarity: 'SR', weight: 60 },
      CactusB: { minSize: 80, maxSize: 100, rarity: 'R', weight: 40 },
    },
  },
};
