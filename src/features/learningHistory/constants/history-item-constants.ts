/**
 * 💡 日本語のラベルやテキストを管理する定数
 */
export const LEARNING_HISTORY_ITEM_TEXTS = {
  // メインエリア
  daysAgo: (days: number) => `${-days}日前`, // 以前の差分は負の値として渡される想定
  timeSeparator: '/',
  testTimeLabel: (count: number, time: number) => ({
    count: `${count}問`,
    time: `${time}分`,
  }),
  // プログレスバーエリア（固定復習待ちの場合）
  fixedReviewToday: '今日復習',
  waitingForReview: (days: number) => `復習待ち（${days}日後）`,
  // プログレスバーエリア（定着度表示）
  fixationLabel: '定着度:',
  percentage: (value: number) => `${Math.floor(value * 100)}%`,
  // 詳細エリア
  problemCountLabel: '問題数:',
  problemCountUnit: '問',
  estimatedTimeLabel: '推定時間:',
  estimatedTimeUnit: '分',
  startReviewButton: '復習開始',
  actionIconAriaLabel: '勉強を開始',
} as const;

export const HISTORY_ITEM_COLORS = {
  // 枠線は薄いグレー（科目色ではなく統一）
  border: '#767676ff',
  // 背景は白に近い色で統一
  bgScreen: '#FFFFFF',
  // テキストは濃い色で統一
  text: '#333333',
  // ピルの背景は非常に薄いグレー
  bgChip: '#F5F5F5',
} as const;
