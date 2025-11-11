import { ReactNode } from 'react';
import {
  CategoryDetail,
  ProblemNumberFormat,
  TestMode,
  UnitDetail,
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

export interface NewUnit extends UnitDetail {
  isNew: boolean;
}

export interface NewCategory extends CategoryDetail {
  isNew: boolean;
}

export interface StartStudyFormProblemMetadata {
  units: NewUnit[];
  categories: NewCategory[];
}

// 新規IDを生成するための関数の型定義
export type StartStudyFormNewIdGenerator = (type: 'unit' | 'category', counter: number) => string;
