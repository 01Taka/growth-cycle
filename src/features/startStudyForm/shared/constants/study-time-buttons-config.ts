import { StudyTimeButtonType, StudyTimeSelectButtonConfig } from '../shared-props-types';

export const STUDY_TIME_BUTTON_CONFIGS: Record<StudyTimeButtonType, StudyTimeSelectButtonConfig> = {
  compact: {
    type: 'compact',
    label: 'コンパクト',
    timeMin: 15,
    explanations: ['さっと復習', '簡単な単元'],
    themeColor: 'yellow',
  },
  balance: {
    type: 'balance',
    label: 'バランス',
    timeMin: 25,
    explanations: ['予習 / 復習', '新規単元'],
    themeColor: 'blue',
  },
  long: {
    type: 'long',
    label: 'ロング',
    timeMin: 45,
    explanations: ['じっくり定着', '難しい単元'],
    themeColor: 'red',
  },
};
