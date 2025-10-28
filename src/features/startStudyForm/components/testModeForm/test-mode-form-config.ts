import { TestMode } from '@/shared/types/study-shared-types';
import { ThemeColor } from '../../shared/theme';

interface TestModeSelectButtonConfig {
  type: TestMode;
  label: string;
  explanations: string[];
  themeColor: ThemeColor;
}

export const testModeButtonsConfig: Record<TestMode, TestModeSelectButtonConfig> = {
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
