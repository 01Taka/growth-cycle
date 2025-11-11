import { TestMode } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TestRangeSelectButtonConfig } from '../components-types/shared-props-types';

export const TEST_RANGE_BUTTON_CONFIGS: Record<TestMode, TestRangeSelectButtonConfig> = {
  memory: {
    type: 'individual',
    label: '個別入力',
    explanations: ['例: 1, 5, 8'],
    themeColor: 'yellow',
  },
  skill: {
    type: 'bulk',
    label: '一括入力',
    explanations: ['例: 1~5, 8~10'],
    themeColor: 'cyan',
  },
};

// 💡 すべての日本語テキストを一元管理するオブジェクト
export const TEXT_CONTENT = {
  // 1. 教科・カテゴリ選択セクション
  COLLAPSE_BUTTON_ARIA_OPEN: '展開',
  COLLAPSE_BUTTON_ARIA_CLOSE: '折りたたむ',
  UNIT_SELECT_LABEL: '単元 (目次の利用推奨)',
  CATEGORY_SELECT_LABEL: '問題の分類 (基本例題, 応用問題など)',
  SUMMARY_UNIT_TITLE: '単元:',
  SUMMARY_CATEGORY_TITLE: '問題の分類:',

  // 2. 現在の範囲指定サマリーと競合解決エリア
  RANGE_SUMMARY_TITLE: '🔢 現在の問題番号指定',
  RANGE_EMPTY_MESSAGE: '条件が指定されていません。',

  // 競合解決エリア
  CONFLICT_ALERT_MESSAGE: '競合または連続値の統合が可能です。',
  CONFLICT_RESOLVE_BUTTON: '競合を解決し、連続値をまとめる',

  // 3. 範囲条件の追加
  RANGE_ADD_TITLE: '＋ 範囲条件を追加',
  RANGE_START_PLACEHOLDER: (min: number) => `開始 (${min})`,
  RANGE_END_PLACEHOLDER: (max: number) => `終了 (${max})`,
  RANGE_ADD_BUTTON: '＋追加',
  RANGE_SEPARATOR: '〜',

  // 4. 個別番号の追加
  INDIVIDUAL_ADD_TITLE: '＋ 個別番号を追加',
  INDIVIDUAL_PLACEHOLDER: '例: 1, 5, 10',
  INDIVIDUAL_ADD_BUTTON: '＋追加',
} as const;
