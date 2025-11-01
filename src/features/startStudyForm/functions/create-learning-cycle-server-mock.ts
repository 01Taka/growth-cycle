import { Timestamp } from 'firebase/firestore';
import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  TestSession,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { Subject } from '@/shared/types/subject-types';
import {
  MOCK_CATEGORY_MASTER_DOCUMENT,
  MOCK_TEXTBOOK_DATA,
  MOCK_UNIT_MASTER_DOCUMENT,
} from './mock-data';

// ============================================================
// 外部環境モック (Firebase Functions Runtime Config 模倣)
// ============================================================

/**
 * Firebase Functionsの functions.config().study.daily_limit に相当するモック。
 */
const MOCK_FUNCTIONS_CONFIG = {
  study: {
    daily_limit: '3', // 環境変数から取得される値は文字列
  },
};

// Functionsのconfig()でアクセスすることを模倣
const DAILY_LIMIT = Number(MOCK_FUNCTIONS_CONFIG.study.daily_limit || '3');

// ============================================================
// 補助的な非同期データ取得/作成関数 (Functions/Firestore GET/ADD 模倣)
// ============================================================

type TextbookMaster = (typeof MOCK_TEXTBOOK_DATA)[keyof typeof MOCK_TEXTBOOK_DATA];
type UnitMaster = (typeof MOCK_UNIT_MASTER_DOCUMENT.units)[number];
type CategoryMaster = (typeof MOCK_CATEGORY_MASTER_DOCUMENT.categories)[number];

let currentUnits: UnitMaster[] = MOCK_UNIT_MASTER_DOCUMENT.units;
let currentCategories: CategoryMaster[] = MOCK_CATEGORY_MASTER_DOCUMENT.categories;
let newIdCounter = 1000;

/**
 * 特定の教科書IDに紐づく教科書マスタデータを非同期で取得する処理を模倣します。
 */
async function getTextbookMasterData(textbookId: string): Promise<TextbookMaster> {
  // 実際: await db.doc(`textbooks/${textbookId}`).get()
  const master = MOCK_TEXTBOOK_DATA[textbookId as keyof typeof MOCK_TEXTBOOK_DATA];
  if (!master) {
    throw new Error(`Textbook ID ${textbookId} のマスタデータが見つかりません。`);
  }
  return master;
}

/**
 * 全ユニットマスタドキュメントを非同期で取得する処理を模倣します。
 */
async function getAllUnitMasterData(): Promise<UnitMaster[]> {
  // 実際: await db.doc('master_data/units').get()
  return MOCK_UNIT_MASTER_DOCUMENT.units;
}

/**
 * 全カテゴリーマスタドキュメントを非同期で取得する処理を模倣します。
 */
async function getAllCategoryMasterData(): Promise<CategoryMaster[]> {
  // 実際: await db.doc('master_data/categories').get()
  return MOCK_CATEGORY_MASTER_DOCUMENT.categories;
}

/**
 * 新しいユニット名を永続化し、更新された全ユニットマスタデータを返却します。
 * * @param newUnitNames - 新規ユニット名の配列
 * @param subjectId - 新規ユニットに割り当てる教科ID（clientDataのテキストブックに依存）
 */
async function createMasterUnitDocument(
  newUnitNames: string[],
  subjectId: Subject
): Promise<UnitMaster[]> {
  // 実際: トランザクション内で master_data/units ドキュメントを更新
  const newUnits: UnitMaster[] = newUnitNames.map((name) => {
    const newId = `u-custom-${newIdCounter++}`;
    // 新規ユニットに指定された教科IDを割り当てる
    return { id: newId, name: name, subjectId: subjectId } as UnitMaster;
  });

  currentUnits = [...currentUnits, ...newUnits];
  return currentUnits;
}

/**
 * 新しいカテゴリー名を永続化し、更新された全カテゴリーマスタデータを返却します。
 * （カテゴリーは教科に依存しないため subjectId は不要）
 */
async function createMasterCategoryDocument(newCategoryNames: string[]): Promise<CategoryMaster[]> {
  // 実際: トランザクション内で master_data/categories ドキュメントを更新
  const newCategories: CategoryMaster[] = newCategoryNames.map((name) => {
    const newId = `c-custom-${newIdCounter++}`;
    // subjectId フィールドは存在しない
    return { id: newId, name: name } as CategoryMaster;
  });

  currentCategories = [...currentCategories, ...newCategories];
  return currentCategories;
}

/**
 * ユーザーが今日取り組んだ勉強の数を非同期でカウントする処理を模倣します。
 */
async function getTodayStudyCount(userId: string, now: Timestamp): Promise<number> {
  // 実際: ユーザーIDと日付境界を用いてクエリを実行

  // サーバーの現在時刻
  const today = now.toDate();

  // UTC今日の00:00と明日の00:00のTimestampを計算 (日付境界クエリに必要)
  const startOfToday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)
  );
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  // 実際はFirestoreクエリを実行（例：userIdのサブコレクション内）
  // await db.collection('users').doc(userId).collection('learningCycles')
  //     .where('cycleStartAt', '>=', Timestamp.fromDate(startOfToday))
  //     .where('cycleStartAt', '<', Timestamp.fromDate(startOfTomorrow))
  //     .count().get();

  // ここでは単純なモック値として返す (ユーザーIDごとに異なる値を返すロジックなどを追加可能)
  const MOCK_TODAY_COUNT = userId === 'user_low_study' ? 2 : 5;
  return MOCK_TODAY_COUNT;
}

// ============================================================
// LearningCycle 作成メイン関数
// ============================================================

/**
 * クライアントからのインプットとサーバー側のロジックを統合し、
 * 完全な LearningCycle ドキュメントを作成する（サーバー模倣関数 - 最終版）。
 *
 * @param clientData クライアントから送信されたデータ
 * @param userId 認証済みのユーザーID
 * @param newUnitNames 新規に作成するユニット名（ユーザー入力）の配列
 * @param newCategoryNames 新規に作成するカテゴリー名（ユーザー入力）の配列
 * @returns サーバー側で生成された完全な LearningCycle ドキュメント
 */
export async function createLearningCycle(
  clientData: LearningCycleClientData,
  newUnitNames: string[] = [],
  newCategoryNames: string[] = []
): Promise<LearningCycle> {
  const userId = 'auth.uid'; // Functions context.auth.uid 相当

  // ------------------------------------------------------------
  // 1. サーバー側でのタイムスタンプと TextbookMaster の取得
  // ------------------------------------------------------------
  const now = Timestamp.now();
  const textbookMaster = await getTextbookMasterData(clientData.textbookId); // **最初に取得**

  // 新規ユニットに割り当てる教科IDは、**テキストブックの教科**とする
  const newUnitSubjectId = textbookMaster.subject as Subject;

  // ------------------------------------------------------------
  // 2. 最初に新規マスターデータの作成/更新を呼び出す
  // ------------------------------------------------------------
  // 新規作成が必要な場合、マスターデータドキュメントを更新し、最新の全リストを取得
  const [updatedUnits, updatedCategories] = await Promise.all([
    // 新規ユニットにはテキストブックの教科IDを渡す
    newUnitNames.length > 0
      ? createMasterUnitDocument(newUnitNames, newUnitSubjectId)
      : getAllUnitMasterData(),
    // カテゴリー作成時には subjectId を渡さない
    newCategoryNames.length > 0
      ? createMasterCategoryDocument(newCategoryNames)
      : getAllCategoryMasterData(),
  ]);

  // ------------------------------------------------------------
  // 3. 残りの初期値と LearningCycle データ処理
  // ------------------------------------------------------------
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const nextReviewDate = new Date(now.toMillis() + oneWeekInMs);
  const nextReviewAt = Timestamp.fromDate(nextReviewDate);
  const initialSessions: TestSession[] = [];

  // 勉強回数を取得
  const todayStudyCount = await getTodayStudyCount(userId, now);

  // ------------------------------------------------------------
  // 4. LearningCycleに埋め込む冗長データ (units, categories) の抽出
  // ------------------------------------------------------------

  const usedUnitIds = new Set(clientData.problems.map((p) => p.unitId));
  const usedCategoryIds = new Set(clientData.problems.map((p) => p.categoryId));
  const learningCycleUnits: UnitDetail[] = [];
  const learningCycleCategories: CategoryDetail[] = [];

  // ユニットの抽出 (更新後のリストを使用)
  for (const unitId of usedUnitIds) {
    const unit = updatedUnits.find((u) => u.id === unitId);
    if (unit) {
      learningCycleUnits.push({ id: unit.id, name: unit.name } as UnitDetail);
    } else {
      throw new Error(`ユニットID ${unitId} がマスタデータに見つかりません。`);
    }
  }

  // カテゴリーの抽出 (更新後のリストを使用)
  for (const categoryId of usedCategoryIds) {
    const category = updatedCategories.find((c) => c.id === categoryId);
    if (category) {
      // カテゴリーのマスターデータにsubjectIdがないため、そのままIDとNameを使用
      learningCycleCategories.push({ id: category.id, name: category.name } as CategoryDetail);
    } else {
      throw new Error(`カテゴリーID ${categoryId} がマスタデータに見つかりません。`);
    }
  }

  // ------------------------------------------------------------
  // 5. 全てのデータを統合して完全な LearningCycle を作成
  // ------------------------------------------------------------
  const newLearningCycle: LearningCycle = {
    ...clientData,
    cycleStartAt: now,
    latestAttemptedAt: now,
    sessions: initialSessions,
    nextReviewAt: nextReviewAt,

    // **環境変数とクエリ結果に基づく isReviewTarget の最終決定**
    isReviewTarget: todayStudyCount < DAILY_LIMIT,

    subject: textbookMaster.subject as Subject,
    textbookName: textbookMaster.name,
    units: learningCycleUnits,
    categories: learningCycleCategories,
  };

  return newLearningCycle;
}
