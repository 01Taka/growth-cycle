import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TestRangeSelectButtonConfig } from '../components-types/shared-props-types';

export const TEST_RANGE_BUTTON_CONFIGS: Record<TestMode, TestRangeSelectButtonConfig> = {
  memory: {
    type: 'individual',
    label: '個別入力',
    explanations: ['例: 1, 5, 8'],
    themeColor: 'yellow',
  },
  skill: {
    type: 'bulk',
    label: '一括入力',
    explanations: ['例: 1~5, 8~10'],
    themeColor: 'cyan',
  },
};
