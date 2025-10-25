import { Timestamp } from 'firebase/firestore';
import {
  CategoryDetail,
  Subject,
  TestMode,
  TestSelfEvaluation,
  UnitDetail,
} from './study-shared-types';

// ------------------------------------------------------------
// Core Data Structures
// ------------------------------------------------------------

/**
 * ユーザーが教科書/単元に対して行った、勉強、テスト、復習を含む一連の学習サイクル（1セットの取り組み）を保持します。
 * Firestoreのドキュメントとして使用されることを想定し、冗長なフィールドを含みます。
 */
export interface LearningCycle {
  /** 紐づく問題集（教科書）のIDです。 */
  textbookId: string;
  /** 問題集の科目を保持します。（textbookIdから参照可能ですが、冗長性のために保持） */
  subject: Subject;
  /** このログに適用された設定情報です。 */
  settings: LearningSettings;
  /** 実行された全テストセッションのリストです。 */
  sessions: TestSession[];
  /**
   * 次にこの学習ログを復習することが推奨される日付（UNIXタイムスタンプ）です。
   * アプリが復習すべきアイテムを提示するために使用されます。
   */
  nextReviewAt: Timestamp;
  latestAttemptedAt: Timestamp;
}

/**
 * テストの設定情報を保持します。
 */
export interface LearningSettings {
  /** 実行するテストのモードです。 */
  testMode: TestMode;
  /** 勉強フェーズに費やした時間（ミリ秒）です。 */
  learningDurationMs: number;
  /** テストフェーズに費やした時間（ミリ秒）です。 */
  testDurationMs: number;

  /** テスト対象のユニット（単元）のIDと名前のオブジェクトリスト */
  units: UnitDetail[];
  /** テスト対象のカテゴリのIDと名前のオブジェクトリスト */
  categories: CategoryDetail[];

  /** テストに含まれる問題のリストです。具体的な問題の詳細を保持し、冗長性を保ちます。 */
  problems: {
    /** LearningCycle内で一意となる、問題の相対インデックスです。 */
    index: number;
    /** 紐づくユニットのIDです。 */
    unitId: string;
    /** 紐づくカテゴリのIDです。 */
    categoryId: string;
    /** 問題集における問題の通し番号などです。 */
    problemNumber: number;
  }[];
}

// ------------------------------------------------------------
// Session Structures
// ------------------------------------------------------------

/**
 * 一度のテスト実行のセッション情報を保持します。
 */
export interface TestSession {
  /** テストが実施された時刻（UNIXタイムスタンプ）です。 */
  attemptedAt: Timestamp;
  /** 各問題に対する結果のリストです。 */
  results: TestResult[];
}

/**
 * 個々の問題に対するテスト結果を保持します。
 */
export interface TestResult {
  /** LearningCycle.settings.problems のindexと対応する問題のインデックスです。 */
  problemIndex: number;
  /** ユーザーによる自己評価です。 */
  selfEvaluation: TestSelfEvaluation;
  /** 正解したかどうかを示します。 */
  isCorrect: boolean;
  /** 問題を解答するのにかかった時間（ミリ秒）です。 */
  timeTakenMs: number;
}
