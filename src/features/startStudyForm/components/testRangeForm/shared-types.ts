/**
 * 外部から渡されるイベントハンドラーの型定義
 */
export interface IndividualRangeFormHandlers {
  onUnitChange: (value: string) => void;
  onUnitSubmit: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCategorySubmit: (value: string) => void;
  onChangeProblemNumber: (value: number) => void;
  onRemove: () => void;
}

/**
 * フォームが保持する値の型定義
 */
export interface IndividualRangeFormValue {
  id: number;
  unit?: string;
  category?: string;
  problemNumber?: number;
}

export interface OnFinishEditModeArgs {
  isNewUnit: boolean;
  isNewCategory: boolean;
  value: IndividualRangeFormValue;
}
