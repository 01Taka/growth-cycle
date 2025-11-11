export interface ColorDetail {
  background: string; // チップや警告エリアの背景色
  accent: string; // アクセントカラー (アイコン、ボーダーの強調色、以前のtext/buttonの役割)
  text: string; // 可読性重視の基本テキストカラー (明度が低い色)
  border: string; // 警告エリアやチップのボーダー色 (チップでは通常backgroundと同じ)
  button?: string; // ボタンの背景色
  buttonText?: string; // ボタンの上のテキスト色 (NEW)
}

export interface ColorSet {
  range: ColorDetail;
  individual: ColorDetail;
  conflict: ColorDetail;
  disabled: ColorDetail;
  addTitle: { accent: string };
}

export interface RangeFormColors {
  light: ColorSet;
  dark: ColorSet;
}

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

export interface RangeTextForm {
  value: string;
  error?: React.ReactNode;
  onChange: (value: string) => void;
}

export interface RangeFormCardManagerPropsBase {
  unitForm: RangeTextForm;
  categoryForm: RangeTextForm;
  hasConflict: boolean;
  ranges: RangeWithId[];
  onRemoveRange: (range: RangeWithId) => void;
  onAddRange: (range: RangeData) => void;
  onResolveConflict: () => void;
}
