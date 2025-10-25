/**
 * テストモードの種別を定義します。
 * 'memory' は勉強した範囲の記憶力（定着度）を測るテストです。
 * 'skill' は範囲外の応用力や知識活用能力（実力）を測るテストです。
 */
export type TestMode = 'memory' | 'skill';

/**
 * テスト実施後の自己評価を定義します。
 */
export type TestSelfEvaluation = 'notSure' | 'imperfect' | 'confident' | 'unrated';

export type Subject = 'japanese' | 'math' | 'science' | 'socialStudies' | 'english' | 'informatics';

/**
 * ユニット（単元）のIDと名前を保持します。冗長性を保つためにStudySettingsに埋め込まれます。
 */
export interface UnitDetail {
  id: string;
  name: string;
}

/**
 * カテゴリのIDと名前を保持します。冗長性を保つためにStudySettingsに埋め込まれます。
 */
export interface CategoryDetail {
  id: string;
  name: string;
}
