// 定数にまとめたタブの定義
export const HISTORY_DETAIL_TABS = [
  { value: 'custom', label: 'カスタム' },
  { value: 'recommended', label: 'おすすめ' },
  { value: 'all', label: 'すべて' },
] as const;

// HistoryDetailModalTabType の型は HISTORY_DETAIL_TABS から推論可能
export type HistoryDetailModalTabType = (typeof HISTORY_DETAIL_TABS)[number]['value'];

// テキスト定数 (ボタンのラベルなど)
export const HISTORY_MODAL_TEXT = {
  clearButton: 'すべて選択を解除',
  selectionCountSeparator: '(',
  selectionCountCloser: ')',
};
