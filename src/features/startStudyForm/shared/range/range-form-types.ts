export interface RangeWithOrder {
  start: number;
  end: number; // end?: number から end: number に変更 (内部処理のため)
  isSingle: boolean;
  order: number; // 元の配列でのインデックス、値が大きいほど優先度が高い
}

export interface RangeData {
  start: number;
  end?: number;
}

export interface RangeWithId extends RangeData {
  id: number;
}

export interface RangeFormCardManagerPropsBase {
  unitForm: {
    value: string;
    error?: React.ReactNode;
    onChange: (value: string) => void;
  };
  categoryForm: {
    value: string;
    error?: React.ReactNode;
    onChange: (value: string) => void;
  };
  hasConflict: boolean;
  ranges: RangeWithId[];
  onRemoveRange: (range: RangeWithId) => void;
  onAddRange: (range: RangeData) => void;
  onResolveConflict: () => void;
}
