// PROBLEM_LIST_TEXTSも修正
export const PROBLEM_LIST_TEXTS = {
  problemNoPrefix: 'No.',
  correctnessRateLabel: '正解率',
  alertNeedReview: '要復習', // lastAttemptSM2Quality < 3 の場合
  alertDueSoon: '順調', // lastAttemptSM2Quality >= 3 の場合
  daysDifferenceLabel: '復習',
  daysUnit: '日',
  getDaysDifferenceUnit: (daysDifference: number) => (daysDifference < 0 ? `過ぎ` : `後`),
};
