import {
  LatestAttemptNecessityReason,
  NecessityColorSet,
  RecentWeightedNecessityReason,
} from '../types/problem-types';

export const REVIEW_NECESSITY_COLORS: {
  light: {
    [key: number]: NecessityColorSet;
  };
  dark: {
    [key: number]: NecessityColorSet;
  };
} = {
  light: {
    0: {
      background: '#dcfce7',
      text: '#166534',
      border: '#86efac',
      accent: '#22c55e',
      reverseText: '#ffffff',
      label: 'OK',
    },
    1: {
      background: '#fef9c3',
      text: '#854d0e',
      border: '#fde047',
      accent: '#facc15',
      reverseText: '#713f12',
      label: '注意',
    },
    2: {
      background: '#fed7aa',
      text: '#9a3412',
      border: '#fb923c',
      accent: '#f97316',
      reverseText: '#ffffff',
      label: '要確認',
    },
    3: {
      background: '#f3e8ff',
      text: '#6b21a8',
      border: '#c084fc',
      accent: '#a855f7',
      reverseText: '#ffffff',
      label: '要復習',
    },
  },
  dark: {
    0: {
      background: '#14532d',
      text: '#bbf7d0',
      border: '#16a34a',
      accent: '#4ade80',
      reverseText: '#052e16',
      label: 'OK',
    },
    1: {
      background: '#713f12',
      text: '#fef08a',
      border: '#eab308',
      accent: '#fde047',
      reverseText: '#422006',
      label: '注意',
    },
    2: {
      background: '#7c2d12',
      text: '#fed7aa',
      border: '#f97316',
      accent: '#fb923c',
      reverseText: '#431407',
      label: '要確認',
    },
    3: {
      background: '#581c87',
      text: '#e9d5ff',
      border: '#a855f7',
      accent: '#c084fc',
      reverseText: '#3b0764',
      label: '要復習',
    },
  },
};

// /**
//  * 💡 確認必要度の理由コードをモバイルUI表示用の【短縮日本語】に変換する定数オブジェクト
//  */
// export const REVIEW_NECESSITY_REASON_LABELS: {
//   [key in LatestAttemptNecessityReason]: string;
// } & {
//   [key in RecentWeightedNecessityReason]: string;
// } = {
//   // --- ロジック1: 最新の試行による理由 ---

//   /** 3: 間違い + 確信あり */
//   overconfidenceError: '過信間違い', // (短縮前: 過信による誤り（最優先）)

//   /** 2: 間違い + 確信なし/未評価 */
//   definiteMistake: '間違い', // (短縮前: 明確な誤り)

//   /** 2: 正解 + 不安 */
//   uncertainCorrect: 'まぐれ正解', // (短縮前: 正解だが不安（運頼み）)

//   /** 1: 正解 + 不完全 */
//   imperfectCorrect: '不安正解', // (短縮前: 正解だが不完全)

//   /** 0: 正解 + 確信あり/未評価 または未評価 */
//   understood: '問題なし', // (短縮前: 確認不要)

//   /** 0: 試行ログなし */
//   noAttempt: '記録なし', // (短縮前: 試行記録なし)

//   // --- ロジック2: 直近2回の試行による重み付け理由 ---

//   /** 3: 直近2回とも高必要性（2以上） */
//   consecutiveMistake: '連続間違い', // (短縮前: 連続して復習が必要)

//   /** 2: 最新の試行のみ高必要性（2以上） */
//   latestHighNecessity: '直近ミス', // (短縮前: 直近の試行で復習が必要)

//   /** 1: 2番目の試行のみ高必要性（2以上） */
//   previousHighNecessity: '前回ミス', // (短縮前: 以前の試行で復習が必要)

//   /** 0: どちらも低必要性（1以下）またはデータなし */
//   none: '安定', // (短縮前: 直近の復習履歴に問題なし)
// }; | DEL? |
