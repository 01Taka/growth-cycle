import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TestModeSelectButtonConfig } from '../components-types/shared-props-types';

export const TEST_MODE_BUTTON_CONFIGS: Record<TestMode, TestModeSelectButtonConfig> = {
  memory: {
    type: 'memory',
    label: '記憶テスト',
    explanations: ['単語などを暗記', '答えを覚えてテスト'],
    themeColor: 'lime',
  },
  skill: {
    type: 'skill',
    label: '実力テスト',
    explanations: ['問題の解き方を勉強', '答えを知らない状態でテスト'],
    themeColor: 'pink',
  },
};
