import { useCallback, useMemo, useState } from 'react';
import { MultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/multi-timer-types';
import { useMultiTimer } from '@/shared/hooks/multi-timer/useMultiTimer';
import { omitObjectKeys } from '@/shared/utils/object/object-utils';

// --- 定数とユーティリティ ---

// メインタイマーのIDと初期時間を定数化
const STUDY_TIMER_ID = 'study';
const TEST_TIMER_ID = 'test';
// 25分をミリ秒で表現: 25 * 60 * 1000
const INITIAL_MAIN_DURATION_MS = 25 * 60000;

// --- カスタムフック ---

export const useStudyTimer = (
  attemptProblemIds: string[],
  timerProvider?: MultiTimerPersistenceProvider
) => {
  const getProblemId = useCallback(
    (index: number | null) => {
      if (index !== null && index >= 0 && index < attemptProblemIds.length) {
        return attemptProblemIds[index];
      }
      return null;
    },
    [attemptProblemIds]
  );

  const getIndexFromProblemId = useCallback(
    (id: string) => {
      return attemptProblemIds.indexOf(id) ?? null;
    },
    [attemptProblemIds]
  );

  // 2. 問題タイマーの初期DurationMapを生成
  const problemDurationMap = useMemo(() => {
    // 問題タイマーのDurationは、全てのタイマーで Number.MAX_SAFE_INTEGER とする
    const data = attemptProblemIds.map((id) => [id, Number.MAX_SAFE_INTEGER]);
    return Object.fromEntries(data);
  }, [attemptProblemIds]); // totalProblemsNumberが変わる時だけ再計算

  // 3. useMultiTimer の初期化
  const timer = useMultiTimer({
    initialDurationMap: {
      [STUDY_TIMER_ID]: INITIAL_MAIN_DURATION_MS,
      [TEST_TIMER_ID]: INITIAL_MAIN_DURATION_MS,
      ...problemDurationMap,
    },
    initialStateMap: {},
    timerEndActionMap: { [STUDY_TIMER_ID]: 'stop', [TEST_TIMER_ID]: 'stopAll' },
    persistenceProvider: timerProvider,
  });

  // 4. SingleTimerの取得
  // timerオブジェクト全体に依存するのではなく、getSingleTimer関数に依存することで
  // timerオブジェクトが変更されない限り再生成されないようにする
  const studyTimer = useMemo(() => timer.getSingleTimer(STUDY_TIMER_ID), [timer.getSingleTimer]);
  const testTimer = useMemo(() => timer.getSingleTimer(TEST_TIMER_ID), [timer.getSingleTimer]);

  const [currentTestProblemIndex, setCurrentTestProblemIndex] = useState<number>(0);

  // 6. 現在アクティブな問題タイマーのインスタンスを取得
  const currentActiveProblemTimer = useMemo(
    () => {
      const id = getProblemId(currentTestProblemIndex);
      if (!!id) {
        return timer.getSingleTimer(id);
      }
      return null;
    },
    // timer.getSingleTimer は関数なので参照が安定していればOK。
    // currentTestProblemIndex が変更されたときのみ再計算
    [timer.getSingleTimer, currentTestProblemIndex, getProblemId]
  );

  const elapsedTimeMap = useMemo(
    () => omitObjectKeys(timer.elapsedTimeMap, [STUDY_TIMER_ID, TEST_TIMER_ID]),
    [timer.elapsedTimeMap]
  );

  const changeCurrentTestProblem = useCallback(
    (newIndex: number, type: 'set' | 'increment') => {
      setCurrentTestProblemIndex((prevIndex) => {
        // インデックスのバリデーション
        let validatedIndex: number = 0;
        if (newIndex !== null) {
          // prevIndexは存在するがエラー対策
          const index = type === 'set' ? newIndex : (prevIndex ?? 0) + newIndex;
          // 0から totalProblemsNumber - 1 の範囲に収める
          validatedIndex = Math.min(Math.max(index, 0), attemptProblemIds.length - 1);
        }

        // 変更がない場合は何もしない
        if (prevIndex === validatedIndex) return prevIndex;

        // メインタイマーが実行中かどうかをチェック (isMainTimerRunningを直接使用)
        const isMainTimerRunning = testTimer.isRunning;

        // 1. 既存のタイマー (prevIndex) があれば停止
        const prevTimerId = getProblemId(prevIndex);
        if (isMainTimerRunning && prevTimerId !== null) {
          timer.stop(prevTimerId);
        }

        // 2. 新しいタイマー (validatedIndex) があれば開始
        const newTimerId = getProblemId(validatedIndex);
        if (isMainTimerRunning && newTimerId !== null) {
          timer.start(newTimerId);
        }

        return validatedIndex;
      });
    },
    // 依存配列にタイマー操作関数と totalProblemsNumber、mainTimer.isRunningを入れる。
    // testTimer.isRunningはchangeProblemTimerが定義される際にキャプチャされる値なので、
    // useMultiTimerのAPIが変更されない限りtimer全体ではなく、timer.stopとtimer.startに依存するのが理想だが、
    // useMultiTimerのAPIが安定していると仮定し、依存関係を絞る。
    [attemptProblemIds.length, testTimer.isRunning, timer.stop, timer.start]
  );

  const isFinishTestTimer = useMemo(() => testTimer.remainingTime < 0, [testTimer.remainingTime]);

  // 8. メインタイマーの実行/停止を切り替える関数
  const handleSwitchTimerRunning = useCallback(() => {
    if (testTimer.isRunning) {
      // 実行中であれば、全て停止
      timer.stopAll();
    } else if (!isFinishTestTimer) {
      // 実行中でなければ、開始
      testTimer.start();
      // アクティブな問題タイマーがあればそれも開始
      if (currentActiveProblemTimer) {
        currentActiveProblemTimer.start();
      }
    }
  }, [testTimer, currentActiveProblemTimer, timer, isFinishTestTimer]); // timer全体を依存に入れることで start/stopAll の安定性を担保

  const changeStudyDuration = useCallback(
    (duration: number) => {
      timer.onDurationChange(STUDY_TIMER_ID, duration);
    },
    [timer.onDurationChange]
  );

  const changeTestDuration = useCallback(
    (duration: number) => {
      timer.onDurationChange(TEST_TIMER_ID, duration);
    },
    [timer.onDurationChange]
  );

  return {
    studyTimer,
    testTimer,
    currentActiveProblemTimer,
    currentTestProblemIndex,
    elapsedTimeMap,
    isFinishTestTimer,
    changeStudyDuration,
    changeTestDuration,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    stopAll: timer.stopAll,
    resetAll: timer.resetAll,
  };
};
