import { calculateReviewNecessity } from '@/features/app/review-necessity/functions/calc-necessity';
import { LearningCycleTestResult } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

type ScoringStatus = 'unrated' | 'correct' | 'incorrect';

// デフォルトの正誤判定関数
const defaultGetScoringStatus = (result: LearningCycleTestResult): ScoringStatus => {
  // LearningCycleTestResultにscoringStatusプロパティがあることを前提とする
  const necessity = calculateReviewNecessity(result.selfEvaluation, result.scoringStatus);
  if (necessity.level === -1) return 'unrated';
  return necessity.level > 1 ? 'incorrect' : 'correct';
};

/**
 * グループ化された問題データに基づき、問題ごとの平均正解率を計算します。
 *
 * @param groupedResults 問題キーをキーとし、関連するテスト結果の配列を値とするオブジェクト
 * @param getScoringStatus スコアリングステータスを取得するためのカスタム関数。指定がない場合はデフォルト関数を使用
 * @returns 問題キーをキーとし、平均正解率 (0.0 から 1.0) を値とするオブジェクト
 */
export const calculateAvgCorrectRate = (
  groupedResults: Record<string, LearningCycleTestResult[]>, // 型を修正
  getScoringStatus: (result: LearningCycleTestResult) => ScoringStatus = defaultGetScoringStatus
): Record<string, number> => {
  const avgCorrectRates: Record<string, number> = {};

  for (const key in groupedResults) {
    if (Object.prototype.hasOwnProperty.call(groupedResults, key)) {
      // 値が LearningCycleTestResult[] に変わったため、変数名を resultsList に変更
      const resultsList = groupedResults[key];

      let correctCount = 0;
      let ratedCount = 0; // 'correct' または 'incorrect' の試行回数 (分母)

      resultsList.forEach((result) => {
        // problemGroup.results から resultsList に変更
        const status = getScoringStatus(result);

        if (status === 'correct') {
          correctCount++;
          ratedCount++;
        } else if (status === 'incorrect') {
          ratedCount++;
        } // 'unrated' の場合は何もせず、カウントに影響を与えない
      }); // 平均正解率を計算

      if (ratedCount > 0) {
        avgCorrectRates[key] = correctCount / ratedCount;
      } else {
        avgCorrectRates[key] = 0.0;
      }
    }
  }

  return avgCorrectRates;
};
