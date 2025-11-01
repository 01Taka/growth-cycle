import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ThemeColor } from './theme';

export type StudyTimeButtonType = 'compact' | 'balance' | 'long';
export type TestRangeInputType = 'individual' | 'bulk';

export interface StudyTimeSelectButtonConfig {
  type: StudyTimeButtonType;
  label: string;
  timeMin: number;
  explanations: string[];
  themeColor: ThemeColor | 'disabled'; // どのテーマを使うか
}

export interface TestModeSelectButtonConfig {
  type: TestMode;
  label: string;
  explanations: string[];
  themeColor: ThemeColor;
}

export interface TestRangeSelectButtonConfig {
  type: TestRangeInputType;
  label: string;
  explanations: string[];
  themeColor: ThemeColor;
}
