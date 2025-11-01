import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TestModeSelectButtonConfig } from '../shared-props-types';

export const TEST_MODE_BUTTON_CONFIGS: Record<TestMode, TestModeSelectButtonConfig> = {
  memory: {
    type: 'memory',
    label: '記憶テスト',
    explanations: ['テスト範囲を勉強', '答えを覚えてテストする'],
    themeColor: 'lime',
  },
  skill: {
    type: 'skill',
    label: '実力テスト',
    explanations: ['テスト範囲外を勉強', '答えを知らない状態でテスト'],
    themeColor: 'pink',
  },
};
