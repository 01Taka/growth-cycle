import * as z from 'zod';
import { generatePlantShapeWithConfigLoad } from '@/features/plants/functions/plant-utils';
import {
  LearningCycle,
  LearningCycleSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  ProblemNumberFormat,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  Textbook,
  TextbookDocument,
  TextbookSchema,
} from '@/shared/data/documents/textbook/textbook-document';
import { generateFirestoreId, generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { Plant, PlantShape } from '@/shared/types/plant-shared-types';
import { getDateAfterDaysBoundary } from '@/shared/utils/datetime/datetime-utils';
import { MAX_PROBLEMS_NUMBER } from './form-constants';
import { StartStudyFormProblemMetadata, StartStudyFormValues } from './form-types';
import { countTotalNumbersInRangeForms } from './form-utils';
import { createProblemsAndUsedMetadata, processProblemMetadata } from './process-form-data';

// --- ヘルパー関数: Textbook関連 ---

/**
 * IDBからTextbookドキュメントを取得する
 */
const fetchTextbook = async (
  textbookPath: string,
  textbookId: string
): Promise<TextbookDocument> => {
  try {
    const textbook = await idbStore.get<TextbookDocument>(textbookPath);
    if (!textbook) {
      throw new Error(
        `指定されたTextbookが見つかりません (ID: ${textbookId}, Path: ${textbookPath})`
      );
    }
    return textbook;
  } catch (error) {
    if (error instanceof Error && error.message.includes('見つかりません')) {
      throw error; // Textbookが見つからないエラーはそのまま再スロー
    }
    throw new Error(`IDBからTextbookの取得に失敗しました (Path: ${textbookPath})`);
  }
};

/**
 * Textbookドキュメントのユニット/カテゴリ/植物を更新し、IDBに保存する
 */
const updateTextbook = async (
  path: string,
  textbook: TextbookDocument,
  problemMeta: StartStudyFormProblemMetadata,
  plant: Plant
): Promise<Textbook> => {
  const existingUnitIds = new Set(textbook.units.map((unit) => unit.id));
  const existingCategoryIds = new Set(textbook.categories.map((category) => category.id));

  // 新規ユニットに新しいIDを生成
  const newUnits: UnitDetail[] = problemMeta.units
    .filter((unit) => !existingUnitIds.has(unit.id))
    .map((unit) => ({ name: unit.name, id: generateFirestoreId() }));

  // 新規カテゴリに新しいIDを生成
  const newCategories: CategoryDetail[] = problemMeta.categories
    .filter((category) => !existingCategoryIds.has(category.id))
    .map((category) => ({
      name: category.name,
      timePerProblem: category.timePerProblem,
      problemNumberFormat: category.problemNumberFormat,
      id: generateFirestoreId(),
    }));

  const newTextbook: Textbook = {
    ...textbook,
    units: [...textbook.units, ...newUnits],
    categories: [...textbook.categories, ...newCategories],
    plants: [...textbook.plants, plant],
    totalPlants: textbook.plants.length + 1,
  };

  try {
    // Textbookスキーマのバリデーション
    TextbookSchema.parse(newTextbook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Textbookバリデーション失敗 (Zod): ${error.message}`);
    }
    throw new Error('Textbookバリデーション中に予期せぬエラーが発生しました');
  }

  try {
    // IDBの更新
    await idbStore.update(path, newTextbook);
    return newTextbook;
  } catch (error) {
    throw new Error(`IDBへのTextbook更新に失敗しました (Path: ${path})`);
  }
};

// --- ヘルパー関数: 問題生成関連 ---

const getNewPlant = (plantShape: PlantShape, now: number): Plant => {
  return {
    ...plantShape,
    id: generateFirestoreId(),
    currentStage: 0,
    lastGrownAt: now,
    textbookPositionX: Math.random(),
  };
};

const getFixedReviewDates = (now: number): string[] => {
  const REVIEW_INTERVAL_DAYS = [1, 7];
  return REVIEW_INTERVAL_DAYS.map((interval) => getDateAfterDaysBoundary(interval, now));
};

// --- メイン関数 ---

/**
 * 新しい学習サイクル（Learning Cycle）を作成し、Textbookを更新後、IDBに保存する
 */
export const createLearningCycle = async (
  textbookId: string,
  form: StartStudyFormValues,
  settings: {
    defaultTimePerProblem: number;
    defaultProblemFormat: ProblemNumberFormat;
    isReviewTarget: boolean;
  },
  seedType: string = 'science'
) => {
  // 1. フォームのバリデーションと早期リターン
  if (
    !form.testMode ||
    form.studyTimeMin === null ||
    form.testTimeMin === null ||
    !form.testRange
  ) {
    // ログなどを追加するとデバッグしやすい
    console.info(
      'Test mode is off or study time or test time is not set. Aborting Learning Cycle creation.'
    );
    return;
  }

  const validRanges = form.testRange.filter((range) => range.ranges.length > 0);

  if (validRanges.length === 0) {
    console.error('range cannot be empty');
    return;
  }

  if (countTotalNumbersInRangeForms(validRanges) > MAX_PROBLEMS_NUMBER) {
    console.error('ranges are too big');
    return;
  }

  const now = Date.now();

  const plantShape = await generatePlantShapeWithConfigLoad(seedType);

  if (!plantShape) {
    throw new Error('Failed to generate plantShape');
  }

  const plant = getNewPlant(plantShape, now);

  // 2. パスの生成
  const newLearningCyclePath = generateIdbPath(IDB_PATH.learningCycles, '', true);
  const textbookPath = generateIdbPath(IDB_PATH.textbooks, textbookId);

  // 3. Textbookの取得
  const textbook = await fetchTextbook(textbookPath, textbookId);

  // 4. 問題メタデータの事前処理（新規ユニット/カテゴリの抽出）
  const problemMeta = processProblemMetadata(
    validRanges,
    textbook.units,
    textbook.categories,
    settings.defaultTimePerProblem,
    settings.defaultProblemFormat
  );

  // 5. Textbookの更新
  const newTextbook = await updateTextbook(textbookPath, textbook, problemMeta, plant);

  // 6. 問題リストと使用メタデータの生成
  const { problems, usedUnits, usedCategories } = createProblemsAndUsedMetadata(
    validRanges,
    newTextbook.units,
    newTextbook.categories
  );

  // 7. LearningCycleオブジェクトの構築

  const newLearningCycleData: LearningCycle = {
    testMode: form.testMode,
    learningDurationMs: form.studyTimeMin * 60000,
    testDurationMs: form.testTimeMin * 60000,
    problems,
    units: usedUnits,
    categories: usedCategories,
    textbookId: textbook.id,
    textbookName: textbook.name,
    subject: textbook.subject,
    sessions: [],
    cycleStartAt: now,
    latestAttemptedAt: now,
    isReviewTarget: settings.isReviewTarget,
    fixedReviewDates: getFixedReviewDates(now),
    plant,
  };

  let parsedLearningCycle = null;

  // 8. LearningCycleのバリデーション
  try {
    parsedLearningCycle = LearningCycleSchema.parse(newLearningCycleData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`LearningCycleバリデーション失敗 (Zod): ${error.message}`);
    }
    throw new Error('LearningCycleバリデーション中に予期せぬエラーが発生しました');
  }

  // 9. IDBに新しいLearningCycleを追加
  try {
    return await idbStore.add(newLearningCyclePath, parsedLearningCycle);
  } catch (error) {
    throw new Error(`IDBへのLearningCycle追加に失敗しました (Path: ${newLearningCyclePath})`);
  }
};
