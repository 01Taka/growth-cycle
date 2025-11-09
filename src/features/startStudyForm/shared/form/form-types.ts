import { ReactNode } from 'react';
import {
  ProblemNumberFormat,
  TestMode,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { RangeWithId } from '../range/range-form-types';

export interface RangeFormData {
  unitName: string;
  categoryName: string;
  ranges: RangeWithId[];

  // 既存カテゴリーの場合
  categoryId?: string;
  // 新規のカテゴリーの場合
  timePerProblemForCategory?: number;
  problemNumberFormatForCategory?: ProblemNumberFormat;
}

/**
 * フォームの状態の型定義
 */
export interface StartStudyFormValues {
  // units: string[];
  studyTimeMin: number | null;
  testMode: TestMode | null;
  testRange: RangeFormData[];
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
