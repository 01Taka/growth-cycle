import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningProblemBase, ProblemAttemptResult } from '../types/problem-types';

/**
 * 入力データを問題の試行履歴の配列に変換します。
 * @param data 変換する入力データオブジェクト
 * @returns 変換された問題試行の配列
 */
export const transformData = (data: LearningCycle): LearningProblemBase[] => {
  const { problems, units, categories, sessions } = data;
  const transformedAttempts: LearningProblemBase[] = [];

  // ユニットとカテゴリのIDと名前のマッピングを効率化のために作成
  const unitMap = new Map(units.map((unit) => [unit.id, unit.name]));
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
  // problemIndexから問題の詳細情報へのマッピング
  const problemDetailMap = new Map(problems.map((problem) => [problem.index, problem]));

  // セッションごとに処理
  sessions.forEach((session) => {
    const attemptAt = session.attemptedAt as number; // attemptedAtはタイムスタンプ（number）と仮定

    // そのセッション内の結果ごとに処理
    session.results.forEach((result) => {
      const problemDetail = problemDetailMap.get(result.problemIndex);

      if (problemDetail) {
        const unitName = unitMap.get(problemDetail.unitId) || 'Unknown Unit';
        const categoryName = categoryMap.get(problemDetail.categoryId) || 'Unknown Category';

        transformedAttempts.push({
          unitName: unitName,
          categoryName: categoryName,
          problemNumber: problemDetail.problemNumber,
          problemIndex: result.problemIndex,
          attemptAt: attemptAt,
        });
      }
    });
  });

  return transformedAttempts;
};

/**
 * LearningCycleオブジェクトをProblemAttemptResultの配列に変換します。
 * @param cycle 変換するLearningCycleオブジェクト
 * @returns すべての問題試行結果を含むProblemAttemptResultの配列
 */
export const convertLearningCycleToAttempts = (cycle: LearningCycle): ProblemAttemptResult[] => {
  const allAttempts: ProblemAttemptResult[] = [];

  // 1. マッピングの作成: IDから名前や詳細へ素早くアクセスできるようにする
  const unitMap = new Map(cycle.units.map((u) => [u.id, u.name]));
  const categoryMap = new Map(cycle.categories.map((c) => [c.id, c.name]));

  // problemIndexから問題の詳細情報へのマッピング
  const problemDetailMap = new Map(cycle.problems.map((p) => [p.index, p]));

  // 2. セッションの反復処理
  cycle.sessions.forEach((session) => {
    const attemptTime = session.attemptedAt;

    // 3. 各セッション内の結果の反復処理
    session.results.forEach((result) => {
      const problemDetail = problemDetailMap.get(result.problemIndex);

      if (problemDetail) {
        // 問題の詳細情報を使用して、ユニット名とカテゴリ名を取得
        const unitName = unitMap.get(problemDetail.unitId) || 'Unknown Unit';
        const categoryName = categoryMap.get(problemDetail.categoryId) || 'Unknown Category';

        // 4. ProblemAttemptResultオブジェクトを作成し、配列に追加
        allAttempts.push({
          scoringStatus: result.scoringStatus,
          selfEvaluation: result.selfEvaluation,
          timeSpentMs: result.timeTakenMs, // timeTakenMsをtimeSpentMsにマップ
          attemptAt: attemptTime,
          unitName: unitName,
          categoryName: categoryName,
          problemNumber: problemDetail.problemNumber,
          problemIndex: result.problemIndex,
        });
      }
    });
  });

  return allAttempts;
};
