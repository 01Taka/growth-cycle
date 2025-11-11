import { useEffect, useMemo, useState } from 'react';
// useSearchParams は引数で受け取るため、フック内でのインポートは削除

import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { MultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/multi-timer-types';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import {
  convertResultsToLearningRecordsByIndex,
  createProblemAttemptResults,
} from '../functions/study-utils';
import { useStudyTimer } from '../hooks/useStudyTimer';
import {
  LearningProblemBase,
  ProblemAttemptDetail,
  ProblemAttemptResult,
} from '../types/problem-types';

interface UseStudyLogicArgs {
  studyDuration: number;
  testDuration: number;
  attemptingProblems: LearningProblemBase[];
  pastAttemptedResults: ProblemAttemptResult[];
  header: { subject: Subject; textbookName: string; units: string[] };
  timerProvider?: MultiTimerPersistenceProvider;
}

export const useStudyLogic = ({
  studyDuration,
  testDuration,
  attemptingProblems,
  pastAttemptedResults,
  header,
  timerProvider,
}: UseStudyLogicArgs) => {
  // 教科はヘッダーから取得
  const subject = header.subject;
  // 1. フェーズ管理 (初期値を受け取り、変更関数は外部のものを利用)

  // 2. 状態管理
  const [selfEvaluationMap, setSelfEvaluationMap] = useState<Record<number, TestSelfEvaluation>>(
    {}
  );
  const [scoringStatusMap, setScoringStatusMap] = useState<Record<number, ProblemScoringStatus>>(
    {}
  );

  // 3. データ生成とタイマーフックの呼び出し
  const {
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isFinishTestTimer,
    changeStudyDuration,
    changeTestDuration,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    resetAll,
  } = useStudyTimer(attemptingProblems.length, timerProvider);

  useEffect(() => {
    changeStudyDuration(studyDuration);
  }, [studyDuration, changeStudyDuration]);

  useEffect(() => {
    changeTestDuration(testDuration);
  }, [testDuration, changeTestDuration]);

  // 4. アクションハンドラ
  const handleSelfEvaluationMap = (index: number, evaluation: TestSelfEvaluation) => {
    setSelfEvaluationMap((prev) => ({ ...prev, [index]: evaluation }));
  };

  const handleScoreChange = (
    problem: ProblemAttemptDetail,
    scoringStatus: ProblemScoringStatus
  ) => {
    setScoringStatusMap((prev) => ({
      ...prev,
      [problem.problemIndex]:
        prev[problem.problemIndex] === scoringStatus ? 'unrated' : scoringStatus,
    }));
  };

  // 5. 派生データの計算 (useMemoを使用)
  const theme = useSubjectColorMap(subject);

  const problems = useMemo(
    () =>
      createProblemAttemptResults(
        attemptingProblems,
        selfEvaluationMap,
        scoringStatusMap,
        elapsedTimeMap
      ),
    [attemptingProblems, selfEvaluationMap, scoringStatusMap, elapsedTimeMap]
  );

  const attemptResults = useMemo(
    () => [...problems, ...pastAttemptedResults],
    [problems, pastAttemptedResults]
  );

  const records = useMemo(
    () => convertResultsToLearningRecordsByIndex(attemptResults),
    [attemptResults]
  );

  // 6. 必要なすべての値を返す
  return {
    header,
    theme,
    problems,
    records,
    selfEvaluationMap,
    scoringStatusMap,
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isFinishTestTimer,
    handleScoreChange,
    handleSelfEvaluationMap,
    resetAll,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
  };
};
