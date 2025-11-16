// 定数にまとめたタブの定義
export const CYCLE_PROBLEMS_MODAL_TABS = [
  { value: 'recommended', label: 'おすすめ' },
  { value: 'all', label: 'すべて' },
  { value: 'custom', label: 'カスタム' },
] as const;

// テキスト定数 (ボタンのラベルなど)
export const CYCLE_PROBLEMS_MODAL_TEXT = {
  clearButton: 'すべて選択を解除',
  selectionCountSeparator: '(',
  selectionCountCloser: ')',
};
