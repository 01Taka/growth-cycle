import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  AttemptLog,
  LearningProblemBase,
  ProblemAttemptResult,
  ProblemLearningRecord,
  ProblemScoringStatus,
} from '../types/problem-types';

type ElapsedTimeMap = Record<number, number>; // numberをキーとするとして処理します。
type SelfEvaluationMap = Record<number, TestSelfEvaluation>;
type ScoringStatusMap = Record<number, ProblemScoringStatus>;

/**
 * LearningProblemBase に 自己評価、採点ステータス、および所要時間の情報を付与します。
 * Map のキーには LearningProblemBase.problemIndex (number) を使用することを前提とします。
 *
 * @param problemKey - 学習問題の識別情報
 * @param selfEvaluationMap - 自己評価のマップ
 * @param scoringStatusMap - 採点ステータスのマップ
 * @param elapsedTimeMap - 所要時間 (ミリ秒) のマップ
 * @returns すべての情報が付与された ProblemAttemptResult
 */
export const createProblemAttemptResult = (
  problemKey: LearningProblemBase,
  selfEvaluationMap: SelfEvaluationMap,
  scoringStatusMap: ScoringStatusMap,
  elapsedTimeMap: ElapsedTimeMap
): ProblemAttemptResult => {
  const { problemIndex } = problemKey;

  // マップから情報を取得。値がない場合はデフォルト値を設定します。
  const selfEvaluation = selfEvaluationMap[problemIndex] ?? 'unrated';
  const scoringStatus = scoringStatusMap[problemIndex] ?? 'unrated';

  // timeSpentMs を取得。値がない場合は 0 を設定します。
  // もしマップのキーがstring型の場合は、 elapsedTimeMap[problemIndex.toString()] ?? 0; とします
  const timeSpentMs = elapsedTimeMap[problemIndex] ?? 0;

  return {
    ...problemKey,
    selfEvaluation: selfEvaluation,
    timeSpentMs: timeSpentMs, // elapsedTimeMap から取得
    scoringStatus: scoringStatus,
  };
};

export const createProblemAttemptResults = (
  problemKeys: LearningProblemBase[],
  selfEvaluationMap: SelfEvaluationMap,
  scoringStatusMap: ScoringStatusMap,
  elapsedTimeMap: ElapsedTimeMap
) => {
  return problemKeys.map((key) =>
    createProblemAttemptResult(key, selfEvaluationMap, scoringStatusMap, elapsedTimeMap)
  );
};

/**
 * ProblemAttemptResultの配列をProblemLearningRecordの配列に変換します。
 * problemIndexのみをキーとしてグループ化し、他のキーが異なる場合は警告ログを出力します。
 *
 * @param results - ProblemAttemptResultの配列
 * @returns ProblemLearningRecordの配列
 */
export const convertResultsToLearningRecordsByIndex = (
  results: ProblemAttemptResult[]
): ProblemLearningRecord[] => {
  // Mapのキーを problemIndex (number) に変更します。
  const recordsMap = new Map<number, ProblemLearningRecord>();

  results.forEach((result) => {
    const { problemIndex } = result;

    // AttemptLogを作成（Timestampはダミーとして、現在の時刻+インデックスを使用）
    const attemptLog: AttemptLog = {
      attemptAt: result.attemptAt,
      selfEvaluation: result.selfEvaluation,
      timeSpentMs: result.timeSpentMs,
      scoringStatus: result.scoringStatus,
    };

    if (recordsMap.has(problemIndex)) {
      // 既存のレコードに試行ログを追加
      const record = recordsMap.get(problemIndex)!;

      // 💡 警告チェック: 既存のレコードとLearningProblemBaseの他のプロパティを比較
      if (
        record.unitName !== result.unitName ||
        record.categoryName !== result.categoryName ||
        record.problemNumber !== result.problemNumber
      ) {
        console.warn(
          `[Warning] Inconsistent LearningProblemBase found for problemIndex: ${problemIndex}. ` +
            `Existing Key: {unitName: ${record.unitName}, categoryName: ${record.categoryName}, problemNumber: ${record.problemNumber}}, ` +
            `New Result Key: {unitName: ${result.unitName}, categoryName: ${result.categoryName}, problemNumber: ${result.problemNumber}}. ` +
            `Grouping continues based on problemIndex, but data integrity is compromised.`
        );
      }

      record.attempts.push(attemptLog);
    } else {
      // 新しいレコードの場合、ProblemLearningRecordを作成し、Mapに追加
      const newRecord: ProblemLearningRecord = {
        unitName: result.unitName,
        categoryName: result.categoryName,
        problemNumber: result.problemNumber,
        problemIndex: problemIndex,
        attempts: [attemptLog],
      };
      recordsMap.set(problemIndex, newRecord);
    }
  });

  // Mapの値を配列に変換して返します
  return Array.from(recordsMap.values());
};
