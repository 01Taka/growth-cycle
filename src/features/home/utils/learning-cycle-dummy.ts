// NOTE: ユーザーの指示に基づき、_generatePlantShapeForMVPは同期関数として利用可能であると仮定します。
// 実際の環境に合わせてインポートパスはそのままにしてあります。
import { _generatePlantShapeForMVP } from '@/features/plants/functions/plant-utils';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleSession } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { generateFirestoreId } from '@/shared/data/idb/generate-path';
import { Plant } from '@/shared/types/plant-shared-types';

const randomInt = (min: number, max: number) => {
  // maxを範囲に含めるため +1 する
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * ダミーのLearningCycleDocumentを生成します。
 * @param numProblems 生成する問題の数
 * @param numSessions 生成するセッションの数
 * @returns LearningCycleDocument
 */
export function generateDummyLearningCycle(
  numProblems: number = 5,
  numSessions: number = 2
): LearningCycleDocument {
  const categories = [
    {
      id: 'cat1',
      name: '計算問題',
      timePerProblem: 30000,
      problemNumberFormat: 'number' as const,
    },
    {
      id: 'cat2',
      name: '文章問題',
      timePerProblem: 60000,
      problemNumberFormat: 'alphabet' as const,
    },
  ];

  const units = [
    { id: 'unitA', name: '基礎' },
    { id: 'unitB', name: '応用' },
  ];

  // 利用可能な教科のリスト
  const subjects: LearningCycleDocument['subject'][] = [
    'japanese',
    'math',
    'science',
    'socialStudies',
    'english',
  ];
  // ランダムな教科を選択
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

  // 教科に対応した教科書名とIDのマップ
  const textbookNameMap: Record<LearningCycleDocument['subject'], string> = {
    japanese: '国語 読解力養成ドリル',
    math: '中学数学 標準問題集',
    science: '理科 系統学習テキスト',
    socialStudies: '社会 歴史集中講座',
    english: '英語 文法徹底マスター',
  };
  const randomTextbookName = textbookNameMap[randomSubject];
  const randomTextbookId = `TBX_${randomSubject.toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  // 1. 問題リストの生成
  const problems = Array.from({ length: numProblems }, (_, i) => ({
    index: i,
    unitId: units[i % units.length].id,
    categoryId: categories[i % categories.length].id,
    problemNumber: i + 1,
  }));

  // 2. セッションリストの生成
  const sessions: LearningCycleSession[] = [];
  const baseTimestamp = Date.now();
  const MS_PER_DAY = 86400000;
  const MAX_LATEST_DAYS_AGO = 14; // 最新セッションが現在から最大14日前

  // 2-0. attemptedAtタイムスタンプをランダムに分散して生成
  const attemptedAtTimestamps: number[] = [];

  // 1. 最新のattemptedAtをランダムに決定 (0日〜14日前)
  const daysAgoForLatest = randomInt(0, MAX_LATEST_DAYS_AGO); // 0〜14日
  let currentTimestamp = baseTimestamp - daysAgoForLatest * MS_PER_DAY;

  // 最新のタイムスタンプを配列に追加
  attemptedAtTimestamps.push(currentTimestamp);

  // 2. それ以前のセッションの日付をランダムな間隔で設定 (新しいものから古いものへ)
  const MIN_GAP_DAYS = 1;
  const MAX_GAP_DAYS = 10;

  for (let i = 1; i < numSessions; i++) {
    // セッション間のランダムな日数差 (1日〜3日)
    const gapDays = randomInt(MIN_GAP_DAYS, MAX_GAP_DAYS);

    // 単純な日単位の境界だけでなく、時刻もランダムにするために、1時間〜23時間のランダムな秒数を差分に加える
    const randomSeconds = randomInt(3600, 82800) * 1000;

    currentTimestamp -= gapDays * MS_PER_DAY + randomSeconds;
    attemptedAtTimestamps.push(currentTimestamp);
  }

  // 時系列順に並び替え（古い日付が先頭、新しい日付が末尾）
  attemptedAtTimestamps.reverse();

  // 3. セッションリストの生成
  for (let s = 0; s < numSessions; s++) {
    const attemptedAt = attemptedAtTimestamps[s]; // ランダムに分散された日付

    // 2-1. セッション結果 (results) の生成
    const results = problems.map((problem) => {
      const isCorrect = Math.random() > 0.3; // 70%の確率で正解
      const selfEvalOptions: LearningCycleSession['results'][number]['selfEvaluation'][] = [
        'confident',
        'imperfect',
        // 'notSure', // 既存のコードを維持
      ];
      const selfEvaluation = selfEvalOptions[Math.floor(Math.random() * selfEvalOptions.length)];

      return {
        problemIndex: problem.index,
        selfEvaluation: selfEvaluation,
        scoringStatus: isCorrect ? ('correct' as const) : ('incorrect' as const),
        timeSpentMs: Math.floor(Math.random() * 50000) + 10000, // 10秒〜60秒
      };
    });

    // 2-2. セッションオブジェクトの生成
    sessions.push({
      gainedXp: results.filter((r) => r.scoringStatus === 'correct').length * 50,
      isFixedReviewSession: s % 3 === 0, // 3回に1回は固定レビューとする
      attemptedAt: attemptedAt,
      results: results,
    });
  }

  // 3. Plant情報の生成
  // _generatePlantShapeForMVP()が同期関数になったことを反映
  const plantShape = _generatePlantShapeForMVP();
  const plant: Plant = {
    ...plantShape,
    id: `plant-${Math.random().toString(36).substring(2, 9)}`,
    currentStage: Math.floor(Math.random() * 4) + 1,
    lastGrownAt: baseTimestamp - 86400000, // 1日前
    textbookPositionX: Math.random() * 100,
  };

  const id = generateFirestoreId();
  // 4. LearningCycleDocumentの生成
  const dummyDocument: LearningCycleDocument = {
    id,
    path: `learningCycles/${id}`,
    textbookId: randomTextbookId, // ランダムな教科ID
    testMode: 'skill',
    learningDurationMs: 3600000,
    testDurationMs: 1800000,
    problems: problems,
    isReviewTarget: true,
    textbookName: randomTextbookName, // ランダムな教科名
    subject: randomSubject, // ★ランダムに選択された教科
    cycleStartAt: sessions.length > 0 ? sessions[0].attemptedAt : baseTimestamp, // 最初のセッション日を開始日とする
    units: units,
    categories: categories,
    sessions: sessions,
    fixedReviewDates: [],
    // 生成されたセッションリストの最新タイムスタンプを参照
    latestAttemptedAt:
      sessions.length > 0 ? sessions[sessions.length - 1].attemptedAt : baseTimestamp,
    plant: plant,
  };

  return dummyDocument;
}

export const generateDummyLearningCycles = (
  cycles: number,
  numProblems: { min: number; max: number } = { min: 3, max: 20 },
  numSessions: { min: number; max: number } = { min: 20, max: 50 }
) => {
  const results: LearningCycleDocument[] = [];
  for (let index = 0; index < cycles; index++) {
    const numP = randomInt(numProblems.min, numProblems.max);
    const numS = randomInt(numSessions.min, numSessions.max);
    const cycle = generateDummyLearningCycle(numP, numS);
    results.push(cycle);
  }
  return results;
};
