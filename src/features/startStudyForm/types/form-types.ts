import { ReactNode } from 'react';
import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { RangeWithId } from './range-form-types';

/**
 * フォームの状態の型定義
 */
export interface StartStudyFormValues {
  units: string[];
  studyTimeMin: number | null;
  testMode: TestMode | null;
  testRange: RangeWithId[];
  testTimeMin: number;
}

export interface StartStudyFormCreatableItems {
  units: string[];
  categories: string[];
}

/**
 * フォームの表示要素の型定義
 */
export interface StartStudyFormComponent {
  label: string;
  form: ReactNode;
}
