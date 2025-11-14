import { useEffect, useMemo, useState } from 'react';
import {
  ExpandedLearningCycle,
  ExpandedLearningCycleProblem,
} from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { MultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/multi-timer-types';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import {
  createExpandedLearningCycleTestResultsFromCycle,
  expandLearningCycle,
  groupingTestResultsByIndex,
} from '../../app/learningCycles/functions/expand-learning-cycle-utils';
import { useStudyTimer } from '../hooks/useStudyTimer';

interface UseStudyLogicArgs {
  learningCycle: LearningCycle | null;
  studyDuration: number;
  testDuration: number;
  header: { subject: Subject; textbookName: string; units: string[] };
  timerProvider?: MultiTimerPersistenceProvider;
  problemCount: number;
}

export const useStudyLogic = ({
  learningCycle,
  studyDuration,
  testDuration,
  header,
  timerProvider,
  problemCount,
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
    stopAll,
    resetAll,
  } = useStudyTimer(problemCount, timerProvider);

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
    problem: ExpandedLearningCycleProblem,
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

  const expandedLearningCycle: ExpandedLearningCycle | null = useMemo(() => {
    return learningCycle ? expandLearningCycle(learningCycle) : null;
  }, [learningCycle]);

  const groupedByIndexTestResults = useMemo(() => {
    if (expandedLearningCycle) {
      const newResults = [
        createExpandedLearningCycleTestResultsFromCycle(
          Date.now(),
          expandedLearningCycle,
          selfEvaluationMap,
          scoringStatusMap,
          elapsedTimeMap
        ),
      ];

      return groupingTestResultsByIndex(expandedLearningCycle, newResults);
    }
    return [];
  }, [expandedLearningCycle, selfEvaluationMap, scoringStatusMap, elapsedTimeMap]);

  const isAllProblemsEvaluated = useMemo(() => {
    const validEvaluations = Object.values(selfEvaluationMap).filter(
      (value) => value !== 'unrated'
    );
    return validEvaluations.length === problemCount;
  }, [selfEvaluationMap, problemCount]);

  // 6. 必要なすべての値を返す
  return {
    header,
    theme,
    selfEvaluationMap,
    scoringStatusMap,
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isAllProblemsEvaluated,
    isFinishTestTimer,
    expandedLearningCycle,
    groupedByIndexTestResults,
    handleScoreChange,
    handleSelfEvaluationMap,
    stopAll,
    resetAll,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
  };
};
