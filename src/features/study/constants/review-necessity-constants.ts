import {
  LatestAttemptNecessityReason,
  NecessityColorSet,
  RecentWeightedNecessityReason,
} from '../types/problem-types';

export const ReviewNecessityColors: {
  light: {
    [key: number]: NecessityColorSet;
  };
  dark: {
    [key: number]: NecessityColorSet;
  };
} = {
  light: {
    0: {
      backgroundColor: '#dcfce7',
      textColor: '#166534',
      borderColor: '#86efac',
      accentColor: '#22c55e',
      reverseTextColor: '#ffffff',
      label: 'OK',
    },
    1: {
      backgroundColor: '#fef9c3',
      textColor: '#854d0e',
      borderColor: '#fde047',
      accentColor: '#facc15',
      reverseTextColor: '#713f12',
      label: '注意',
    },
    2: {
      backgroundColor: '#fed7aa',
      textColor: '#9a3412',
      borderColor: '#fb923c',
      accentColor: '#f97316',
      reverseTextColor: '#ffffff',
      label: '要確認',
    },
    3: {
      backgroundColor: '#f3e8ff',
      textColor: '#6b21a8',
      borderColor: '#c084fc',
      accentColor: '#a855f7',
      reverseTextColor: '#ffffff',
      label: '要復習',
    },
  },
  dark: {
    0: {
      backgroundColor: '#14532d',
      textColor: '#bbf7d0',
      borderColor: '#16a34a',
      accentColor: '#4ade80',
      reverseTextColor: '#052e16',
      label: 'OK',
    },
    1: {
      backgroundColor: '#713f12',
      textColor: '#fef08a',
      borderColor: '#eab308',
      accentColor: '#fde047',
      reverseTextColor: '#422006',
      label: '注意',
    },
    2: {
      backgroundColor: '#7c2d12',
      textColor: '#fed7aa',
      borderColor: '#f97316',
      accentColor: '#fb923c',
      reverseTextColor: '#431407',
      label: '要確認',
    },
    3: {
      backgroundColor: '#581c87',
      textColor: '#e9d5ff',
      borderColor: '#a855f7',
      accentColor: '#c084fc',
      reverseTextColor: '#3b0764',
      label: '要復習',
    },
  },
};

/**
 * 💡 確認必要度の理由コードをモバイルUI表示用の【短縮日本語】に変換する定数オブジェクト
 */
export const REVIEW_NECESSITY_REASON_LABELS: {
  [key in LatestAttemptNecessityReason]: string;
} & {
  [key in RecentWeightedNecessityReason]: string;
} = {
  // --- ロジック1: 最新の試行による理由 ---

  /** 3: 間違い + 確信あり */
  overconfidenceError: '過信間違い', // (短縮前: 過信による誤り（最優先）)

  /** 2: 間違い + 確信なし/未評価 */
  definiteMistake: '間違い', // (短縮前: 明確な誤り)

  /** 2: 正解 + 不安 */
  uncertainCorrect: 'まぐれ正解', // (短縮前: 正解だが不安（運頼み）)

  /** 1: 正解 + 不完全 */
  imperfectCorrect: '不安正解', // (短縮前: 正解だが不完全)

  /** 0: 正解 + 確信あり/未評価 または未評価 */
  noNeed: '問題なし', // (短縮前: 確認不要)

  /** 0: 試行ログなし */
  noAttempt: '記録なし', // (短縮前: 試行記録なし)

  // --- ロジック2: 直近2回の試行による重み付け理由 ---

  /** 3: 直近2回とも高必要性（2以上） */
  consecutiveMistake: '連続間違い', // (短縮前: 連続して復習が必要)

  /** 2: 最新の試行のみ高必要性（2以上） */
  latestHighNecessity: '直近ミス', // (短縮前: 直近の試行で復習が必要)

  /** 1: 2番目の試行のみ高必要性（2以上） */
  previousHighNecessity: '前回ミス', // (短縮前: 以前の試行で復習が必要)

  /** 0: どちらも低必要性（1以下）またはデータなし */
  none: '安定', // (短縮前: 直近の復習履歴に問題なし)
};
