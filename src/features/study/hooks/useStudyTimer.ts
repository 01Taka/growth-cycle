import { useCallback, useMemo, useState } from 'react';
import { LocalStorageMultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/localStoragePersistenceProvider';
import { useMultiTimer } from '@/shared/hooks/multi-timer/useMultiTimer';
import { range } from '@/shared/utils/range';

// --- 定数とユーティリティ ---

// メインタイマーのIDと初期時間を定数化
const STUDY_TIMER_ID = 'study';
const TEST_TIMER_ID = 'test';
// 25分をミリ秒で表現: 25 * 60 * 1000
const INITIAL_MAIN_DURATION_MS = 25 * 60000;
const PERSISTENCE_KEY = 'multiTimer';

/**
 * 特定のインデックスの問題タイマーIDを生成する
 * @param index - 問題のインデックス
 * @returns 問題タイマーのID文字列
 */
const getProblemTimerId = (index: number): string => {
  return `problem_timer_${index}`;
};

/**
 * 問題タイマーIDから問題のインデックスを抽出する
 * @param timerId - 問題タイマーのID文字列 (例: "problem_timer_123")
 * @returns 問題のインデックス (数値) エラー時は -1
 */
const getProblemIndexFromTimerId = (timerId: string): number => {
  const prefix = 'problem_timer_';

  if (!timerId.startsWith(prefix)) {
    console.error(`IDの形式が不正です。"${prefix}"で始まっていません: ${timerId}`);
    return -1;
  }

  // プレフィックス以降の部分を取得
  const indexString = timerId.substring(prefix.length);

  // 数値への変換を試みる
  const index = parseInt(indexString, 10);

  // 有効な数値であることを確認
  if (isNaN(index)) {
    console.error(`IDの形式が不正です。インデックス部分が数値ではありません: ${timerId}`);
    return -1;
  }

  return index;
};

// --- カスタムフック ---

export const useStudyTimer = (totalProblemsNumber: number) => {
  // 1. Persistence Providerの初期化
  const timerProvider = useMemo(
    () => new LocalStorageMultiTimerPersistenceProvider(PERSISTENCE_KEY),
    [] // 依存配列は空でOK
  );

  // 2. 問題タイマーの初期DurationMapを生成
  const problemDurationMap = useMemo(() => {
    // 問題タイマーのDurationは、全てのタイマーで Number.MAX_SAFE_INTEGER とする
    const data = range(totalProblemsNumber).map((index) => [
      getProblemTimerId(index),
      Number.MAX_SAFE_INTEGER,
    ]);
    return Object.fromEntries(data);
  }, [totalProblemsNumber]); // totalProblemsNumberが変わる時だけ再計算

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

  const [currentTestProblemIndex, setCurrentTestProblemIndex] = useState<number | null>(null);

  // 6. 現在アクティブな問題タイマーのインスタンスを取得
  const currentActiveProblemTimer = useMemo(
    () => {
      // インデックスがnullでなく、かつ totalProblemsNumber の範囲内であることを確認
      if (
        currentTestProblemIndex !== null &&
        currentTestProblemIndex >= 0 &&
        currentTestProblemIndex < totalProblemsNumber
      ) {
        const id = getProblemTimerId(currentTestProblemIndex);
        return timer.getSingleTimer(id);
      }
      return null;
    },
    // timer.getSingleTimer は関数なので参照が安定していればOK。
    // currentTestProblemIndex が変更されたときのみ再計算
    [timer.getSingleTimer, currentTestProblemIndex, totalProblemsNumber]
  );

  const elapsedTimeMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(timer.elapsedTimeMap)
          .map(([key, value]) => {
            if (key === TEST_TIMER_ID || key === STUDY_TIMER_ID) return undefined;
            const index = getProblemIndexFromTimerId(key);
            if (index !== -1) {
              return [index, value] as const;
            }
            return undefined;
          })
          .filter((entry): entry is readonly [number, number] => entry !== undefined)
      ),
    [timer.elapsedTimeMap]
  );

  const changeCurrentTestProblem = useCallback(
    (newIndex: number | null, type: 'set' | 'increment') => {
      setCurrentTestProblemIndex((prevIndex) => {
        // インデックスのバリデーション
        let validatedIndex: number | null = null;
        if (newIndex !== null) {
          // prevIndexは存在するがエラー対策
          const index = type === 'set' ? newIndex : (prevIndex ?? 0) + newIndex;
          // 0から totalProblemsNumber - 1 の範囲に収める
          validatedIndex = Math.min(Math.max(index, 0), totalProblemsNumber - 1);
        }

        // 変更がない場合は何もしない
        if (prevIndex === validatedIndex) return prevIndex;

        // メインタイマーが実行中かどうかをチェック (isMainTimerRunningを直接使用)
        const isMainTimerRunning = testTimer.isRunning;

        // 1. 既存のタイマー (prevIndex) があれば停止
        if (isMainTimerRunning && prevIndex !== null) {
          const prevTimerId = getProblemTimerId(prevIndex);
          timer.stop(prevTimerId);
        }

        // 2. 新しいタイマー (validatedIndex) があれば開始
        if (isMainTimerRunning && validatedIndex !== null) {
          const newTimerId = getProblemTimerId(validatedIndex);
          timer.start(newTimerId);
        }

        return validatedIndex;
      });
    },
    // 依存配列にタイマー操作関数と totalProblemsNumber、mainTimer.isRunningを入れる。
    // testTimer.isRunningはchangeProblemTimerが定義される際にキャプチャされる値なので、
    // useMultiTimerのAPIが変更されない限りtimer全体ではなく、timer.stopとtimer.startに依存するのが理想だが、
    // useMultiTimerのAPIが安定していると仮定し、依存関係を絞る。
    [totalProblemsNumber, testTimer.isRunning, timer.stop, timer.start]
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

  return {
    studyTimer,
    testTimer,
    currentActiveProblemTimer,
    currentTestProblemIndex,
    elapsedTimeMap,
    isFinishTestTimer,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    resetAll: timer.resetAll,
  };
};
