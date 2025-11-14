import {
  EvaluatedLabel,
  GroupEvaluatedLabel,
  GroupUnratedLabel,
  UnratedLabel,
} from '../types/review-necessity-types';

export const REVIEW_NECESSITY_REASON_LABELS: {
  [key in EvaluatedLabel | UnratedLabel | GroupEvaluatedLabel | GroupUnratedLabel]: string;
} = {
  // --- 評価済み（レベル 0-3）の理由 (EvaluatedLabel) ---
  overconfidenceError: '過信間違い', // 3: 間違い + 確信あり
  mistakeNotSure: '間違い', // 2: 間違い + 自信なし
  mistakeImperfect: '不安間違い', // 2: 間違い + 不完全
  uncertainCorrect: 'まぐれ正解', // 2: 正解 + 自信なし
  imperfectCorrect: '不安正解', // 1: 正解 + 不完全
  understood: '理解済み', // 0: 正解 + 確信あり

  // --- 未評価（レベル -1）の理由 (UnratedLabel) ---
  fullyUnrated: '未評価',
  scoreUnratedConfident: '未採点(自信あり)',
  scoreUnratedImperfect: '未採点(不安/曖昧)',
  scoreUnratedNotSure: '未採点(分からない)',
  selfUnratedCorrect: '正解(未評価)',
  selfUnratedIncorrect: '間違い(未評価)',

  // --- グループ評価済みの理由 (GroupEvaluatedLabel) ---
  consecutiveMistakes: '連続ミス',
  failedLatestAttempt: '直近ミス',
  failedSecondToLastAttempt: '前回ミス',
  consecutiveCorrect: '連続正解',

  // --- グループ未評価の理由 (GroupUnratedLabel) ---
  insufficientRatedAttempts: '試行不足',
};
