/**
 * テストの設定情報を保持します。
 */
export interface FormatLearningSettings {
  /**
   * ユニットIDをキー、ユニット名を値とするマップです。
   */
  unitMap: Record<string, string>;

  /**
   * カテゴリIDをキー、カテゴリ名を値とするマップです。
   */
  categoryMap: Record<string, string>;

  /** テストに含まれる問題のリストです。具体的な問題の詳細を保持し、冗長性を保ちます。 */
  problems: {
    /** LearningCycle内で一意となる、問題の相対インデックスです。 */
    index: number;
    /** 紐づくユニットのIDです。 */
    unitId: string;
    /** 紐づくカテゴリのIDです。 */
    categoryId: string;
    /** 紐づくユニットの名前です。 */
    unitName: string;
    /** 紐づくカテゴリの名前です。 */
    categoryName: string;
    /** 問題集における問題の通し番号などです。 */
    problemNumber: number;
  }[];
}
