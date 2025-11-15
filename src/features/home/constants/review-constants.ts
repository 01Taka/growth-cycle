// --- スタイル定義 (変更なし) ---
export const COLORS = {
  cardBg: '#F5F0E6',
  pillBg: '#ffb84e',
  cardBorder: '#EA8E00',
  orangeButton: '#ed8e00',
  textDark: '#2B2B2B',
  completedGreen: '#4CAF50',
} as const;

export const STRINGS = {} as const;

/**
 * 日付差（dayDiffKey）を日本語のラベルに変換する定数オブジェクト
 * @param dayDiffKey 日付差を表す文字列キー（例: '0', '1', '-1'）
 * @returns ラベル文字列
 */
export const REVIEW_LABELS = {
  // 日付差を日本語のラベルに変換する関数
  getDateLabel: (dayDiffKey: string): string => {
    const dayDiff = parseInt(dayDiffKey, 10);
    if (dayDiff === 0) return '今日';
    if (dayDiff === 1) return '昨日';
    if (dayDiff === -1) return '明日';
    if (dayDiff > 0) return `${dayDiff}日前`;
    return `${Math.abs(dayDiff)}日後`;
  },
  // コンポーネント内で使用されているその他のラベル
  reviewPlannedTitle: '復習予定',
  reviewCompletedTitle: '復習済み',

  headerTitle: '🗓️ 今日の復習',
  remainingTasksLabel: '残りタスク:',
  noReviewData: '復習予定のデータがありません。',
  noReviewedData: '復習済みのデータがありません。',
  noTabsData: '表示する復習データがありません。',
  getProgressPillLabel: (current: number, total: number) => `進捗: ${current} / ${total}`,
} as const;
