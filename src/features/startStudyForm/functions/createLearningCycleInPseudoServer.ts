import { Timestamp } from 'firebase/firestore';
import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  TestSession,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { Subject } from '@/shared/types/subject-types';
import { FirestorePaths } from './config';
import { pseudoDb } from './pseudo-firestore';

const MOCK_FUNCTIONS_CONFIG = {
  study: {
    daily_limit: '3',
  },
};
const DAILY_LIMIT = Number(MOCK_FUNCTIONS_CONFIG.study.daily_limit || '3');

// ============================================================
// 補助的な非同期データ取得/作成関数 (PseudoFirestore 経由)
// ============================================================

// LearningCycleに埋め込まれる型
interface MasterItem {
  id: string;
  name: string;
  subjectId?: Subject | 'common';
}
type UnitMaster = MasterItem & { subjectId: Subject | 'common' };
type CategoryMaster = Omit<MasterItem, 'subjectId'>;
type TextbookMaster = { subject: Subject; textbookName: string };

// ============================================================
// 補助的な非同期データ取得/作成関数 (PseudoFirestore 経由)
// ============================================================

/**
 * 特定の教科書IDに紐づく教科書マスタデータを非同期で取得します。
 */
async function getTextbookMasterData(textbookId: string): Promise<TextbookMaster> {
  const path = FirestorePaths.TEXTBOOK_DOC(textbookId);
  const master = await pseudoDb.get<TextbookMaster>(path);
  if (!master) {
    throw new Error(`Textbook ID ${textbookId} のマスタデータが見つかりません。`);
  }
  return master;
}

/**
 * 全ユニットマスタドキュメントを非同期で取得し、配列を返します。
 */
export async function getAllUnitMasterData(userId: string): Promise<UnitMaster[]> {
  const path = FirestorePaths.USER_MASTER_UNITS_DOC(userId);
  const doc = await pseudoDb.get<{ units: UnitMaster[] }>(path);
  return doc?.units || [];
}

/**
 * 全カテゴリーマスタドキュメントを非同期で取得し、配列を返します。
 */
export async function getAllCategoryMasterData(userId: string): Promise<CategoryMaster[]> {
  const path = FirestorePaths.USER_MASTER_CATEGORIES_DOC(userId);
  const doc = await pseudoDb.get<{ categories: CategoryMaster[] }>(path);
  return doc?.categories || [];
}

/**
 * 新しいユニット名を永続化し、更新された全ユニットマスタデータを返却します。
 */
async function createMasterUnitDocument(
  userId: string,
  newUnitNames: string[],
  subjectId: Subject
): Promise<UnitMaster[]> {
  const unitDocPath = FirestorePaths.USER_MASTER_UNITS_DOC(userId);
  const unitDoc = (await pseudoDb.get<{ units: UnitMaster[] }>(unitDocPath)) || { units: [] };

  let newIdCounter = unitDoc.units.length + 1000;
  const newUnits: UnitMaster[] = newUnitNames.map((name) => {
    const newId = `u-custom-${newIdCounter++}`;
    return { id: newId, name: name, subjectId: subjectId } as UnitMaster;
  });

  unitDoc.units = [...unitDoc.units, ...newUnits];
  await pseudoDb.set(unitDocPath, unitDoc);
  return unitDoc.units;
}

/**
 * 新しいカテゴリー名を永続化し、更新された全カテゴリーマスタデータを返却します。
 */
async function createMasterCategoryDocument(
  userId: string,
  newCategoryNames: string[]
): Promise<CategoryMaster[]> {
  const categoryDocPath = FirestorePaths.USER_MASTER_CATEGORIES_DOC(userId);
  const categoryDoc = (await pseudoDb.get<{ categories: CategoryMaster[] }>(categoryDocPath)) || {
    categories: [],
  };

  let newIdCounter = categoryDoc.categories.length + 2000;
  const newCategories: CategoryMaster[] = newCategoryNames.map((name) => {
    const newId = `c-custom-${newIdCounter++}`;
    return { id: newId, name: name } as CategoryMaster;
  });

  categoryDoc.categories = [...categoryDoc.categories, ...newCategories];
  await pseudoDb.set(categoryDocPath, categoryDoc);
  return categoryDoc.categories;
}

// (他の補助関数とインポートは変更なし)

// LearningCycleドキュメントの型（cycleStartAtを持つもの）
interface LearningCycleWithTimestamp {
  cycleStartAt: Timestamp;
}

/**
 * サーバー側でUTC今日の00:00と明日の00:00のTimestampを計算します。
 */
function getDayBoundaryTimestamps(now: Date): { start: Timestamp; end: Timestamp } {
  // UTCの境界を取得
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  return {
    start: Timestamp.fromDate(startOfToday),
    end: Timestamp.fromDate(startOfTomorrow),
  };
}

/**
 * ユーザーの全 LearningCycle ドキュメントを、ローカルストレージから読み取る関数を定義。
 * (Firestoreで言えば、コレクション全体のスナップショットを取得する操作を模倣)
 */
async function getLearningCyclesForUser(userId: string): Promise<LearningCycleWithTimestamp[]> {
  const collectionPath = FirestorePaths.LEARNING_CYCLES_COLLECTION(userId);
  await pseudoDb.simulateLatency();

  // Firestoreでは通常、コレクションの全ドキュメントを取得するクエリはありませんが、
  // 疑似環境では全コレクションデータを格納した単一ドキュメントを読み取ることで模倣します。
  // 例: /users/{userId}/learningCycles/_all_cycles ドキュメント

  // ユーザーサブコレクションを全て読み込むのは非効率なため、
  // 疑似DBにはコレクション全体を一つのJSONオブジェクトとして格納していると仮定します。
  // ただし、PseudoFirestoreはドキュメント単位なので、ここでは特定のドキュメントを読み込みます。

  // 読み込みの簡易化のため、ここではダミーの配列を返すロジックにします。
  // 実際のアプリケーションでは、ユーザーのLearningCyclesコレクション内の全ドキュメントを取得する必要があります。

  // 実行時にLearningCycleが追加されている可能性を考慮し、ローカルストレージ全体から該当ユーザーのサイクルを検索するロジックを導入すべきですが、
  // PseudoFirestoreがドキュメント単位の操作しかサポートしていないため、
  // 特定のキーに全サイクルデータが配列として格納されていると仮定します。

  // **今回は、テストのために特別に定義したキーから全サイクルデータを読み込みます。**
  const ALL_CYCLES_STORAGE_KEY = `pseudo_db_learning_cycles_all_${userId}`;
  const storedData = localStorage.getItem(ALL_CYCLES_STORAGE_KEY);

  if (storedData) {
    try {
      return JSON.parse(storedData) as LearningCycleWithTimestamp[];
    } catch (e) {
      console.error(`Error reading all cycles for user ${userId}`, e);
      return [];
    }
  }

  // データがない場合は空の配列を返す
  return [];
}

/**
 * ユーザーが今日取り組んだ勉強の数を非同期でカウントする処理を模倣します。
 * (ローカルストレージの値をもとに返り値を決定します)
 */
async function getTodayStudyCount(userId: string, now: Timestamp): Promise<number> {
  const nowAsDate = now.toDate();
  const { start, end } = getDayBoundaryTimestamps(nowAsDate);

  // 1. ユーザーの全LearningCycleをローカルストレージから読み込む
  const allCycles = await getLearningCyclesForUser(userId);

  // 2. フィルタリングとカウントのロジックを適用
  const todayCount = allCycles.filter((cycle) => {
    // cycleStartAtが今日の境界内にあるかチェック
    const cycleTime = cycle.cycleStartAt.toMillis();
    const startTime = start.toMillis();
    const endTime = end.toMillis();

    return cycleTime >= startTime && cycleTime < endTime;
  }).length;

  console.log(`[StudyCount] ユーザー ${userId} の今日の勉強数: ${todayCount} 件`);

  return todayCount;
}

// ============================================================
// LearningCycle 作成メイン関数 (疑似サーバー版)
// ============================================================

export async function createLearningCycleInPseudoServer(
  clientData: LearningCycleClientData,
  userId: string, // Functions context.auth.uid 相当
  newUnitNames: string[] = [],
  newCategoryNames: string[] = []
): Promise<LearningCycle> {
  // ------------------------------------------------------------
  // 1. サーバー側でのタイムスタンプと TextbookMaster の取得
  // ------------------------------------------------------------
  const now = Timestamp.now();
  const textbookMaster = await getTextbookMasterData(clientData.textbookId);
  const newUnitSubjectId = textbookMaster.subject as Subject;

  // ------------------------------------------------------------
  // 2. 最初に新規マスターデータの作成/更新を呼び出す (ユーザーIDを渡す)
  // ------------------------------------------------------------
  const [updatedUnits, updatedCategories] = await Promise.all([
    newUnitNames.length > 0
      ? createMasterUnitDocument(userId, newUnitNames, newUnitSubjectId)
      : getAllUnitMasterData(userId),
    newCategoryNames.length > 0
      ? createMasterCategoryDocument(userId, newCategoryNames)
      : getAllCategoryMasterData(userId),
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

  // ... (冗長データの抽出ロジックは変更なし、updatedUnits/updatedCategoriesを使用)
  const usedUnitIds = new Set(clientData.problems.map((p) => p.unitId));
  const usedCategoryIds = new Set(clientData.problems.map((p) => p.categoryId));
  const learningCycleUnits: UnitDetail[] = [];
  const learningCycleCategories: CategoryDetail[] = [];

  for (const unitId of usedUnitIds) {
    const unit = updatedUnits.find((u) => u.id === unitId);
    if (unit) {
      learningCycleUnits.push({ id: unit.id, name: unit.name } as UnitDetail);
    } else {
      throw new Error(`ユニットID ${unitId} がマスタデータに見つかりません。`);
    }
  }

  for (const categoryId of usedCategoryIds) {
    const category = updatedCategories.find((c) => c.id === categoryId);
    if (category) {
      learningCycleCategories.push({ id: category.id, name: category.name } as CategoryDetail);
    } else {
      throw new Error(`カテゴリーID ${categoryId} がマスタデータに見つかりません。`);
    }
  }

  // ------------------------------------------------------------
  // 4. 全てのデータを統合して完全な LearningCycle を作成
  // ------------------------------------------------------------
  const newLearningCycle: LearningCycle = {
    ...clientData,
    cycleStartAt: now,
    latestAttemptedAt: now,
    sessions: initialSessions,
    nextReviewAt: nextReviewAt,

    isReviewTarget: todayStudyCount < DAILY_LIMIT,

    subject: textbookMaster.subject as Subject,
    textbookName: textbookMaster.textbookName,
    units: learningCycleUnits,
    categories: learningCycleCategories,
  };

  return newLearningCycle;
}

/**
 * サーバー処理（LearningCycle作成と永続化）を完全に再現する関数。
 * @param clientData クライアントから送信されたデータ
 * @param newUnits 新規に作成するユニット名（ユーザー入力）の配列
 * @param newCategories 新規に作成するカテゴリー名（ユーザー入力）の配列
 */
export async function runLearningCycleScenario(
  clientData: LearningCycleClientData,
  newUnits: string[] = [],
  newCategories: string[] = []
) {
  const TEST_USER_ID = 'user_low_study'; // 固定ユーザーID
  const CYCLE_DOC_ID = `cycle_${Date.now()}`; // 実行ごとにユニークなIDを生成

  // ----------------------------------------
  // 0. セットアップと初期化 (初回実行時のみ、またはテストケースごとに実行)
  // ----------------------------------------

  console.log(`\n--- ユーザー: ${TEST_USER_ID} で LearningCycle 作成処理を開始 ---`);

  // ----------------------------------------
  // 1. サーバー側処理の実行とドキュメント生成 (読み込みとマスターデータ更新が発生)
  // ----------------------------------------
  const newLearningCycle = await createLearningCycleInPseudoServer(
    clientData,
    TEST_USER_ID,
    newUnits,
    newCategories
  );

  console.log('✅ LearningCycle ドキュメントがサーバー側で生成されました。');
  console.log(`  -> isReviewTarget (期待値: true): ${newLearningCycle.isReviewTarget}`);
  console.log(`  -> 処理されたユニット数: ${newLearningCycle.units.length}`);

  // ----------------------------------------
  // 2. LearningCycleの永続化 (書き込み)
  // ----------------------------------------
  const cyclePath = `${FirestorePaths.LEARNING_CYCLES_COLLECTION(TEST_USER_ID)}/${CYCLE_DOC_ID}`;
  await pseudoDb.set(cyclePath, newLearningCycle);
  console.log(`✅ LearningCycle が DB に書き込まれました: ${cyclePath}`);

  // ----------------------------------------
  // 3. 検証 (DBからの読み込みとマスターデータの検証)
  // ----------------------------------------
  const retrievedCycle = await pseudoDb.get<LearningCycle>(cyclePath);
  const updatedUnitsMaster = await pseudoDb.get<{ units: any[] }>(
    FirestorePaths.USER_MASTER_UNITS_DOC(TEST_USER_ID)
  );

  console.log('\n--- 検証結果 ---');
  if (retrievedCycle) {
    console.log(`✅ 読み込み成功。TextbookName: ${retrievedCycle.textbookName}`);
    console.log(`✅ サーバー決定値 isReviewTarget: ${retrievedCycle.isReviewTarget}`);
  } else {
    console.error('❌ LearningCycle の読み込みに失敗しました。');
  }

  // 新規作成されたユニット名があれば検証
  if (newUnits.length > 0) {
    const foundNewUnit = updatedUnitsMaster?.units.some((u: any) => u.name === newUnits[0]);
    console.log(
      `✅ マスターデータ更新検証 (新規ユニット "${newUnits[0]}"): ${foundNewUnit ? '成功' : '失敗'}`
    );
    console.log(`   -> 現在の全ユニット数: ${updatedUnitsMaster?.units.length}`);
  } else {
    console.log('--- 新規ユニットは作成されませんでした。 ---');
  }
}
