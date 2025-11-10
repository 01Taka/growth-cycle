/**
 * 植物を構成する個々のパーツ（モジュール）の定義
 * * Plant.modules 内では、part名はRecordのキーとして重複して格納されている
 */
export interface PlantModule {
  part: string; // どの部位か ("stem", "flower"など)
  moduleType: string; // 具体的なバリエーションID (例: "thick_v1")
  moduleRarity: string; // このモジュールのレアリティ (R, SRなど)
}

/**
 * 完全に成長した植物の個体データ
 */
export interface Plant {
  seedType: string;
  size: number;
  plantType: string;
  plantRarity: string;
  // PlantModuleを、part名をキーとして格納する辞書形式のレコード
  modules: Record<string, PlantModule>;
}

/**
 * モジュールを特定するための基本構造
 */
export interface ModuleStructure {
  seedType: string;
  plantType: string;
  partType: string;
  moduleType: string;
}

/**
 * 静的なモジュール設定情報（画像パスなど）
 */
export interface ModuleSetting {
  imgPath: string; // 画像パス
  zIndex: number; // レンダリングのためのZ-Index
}

/**
 * 抽選ロジックに使用する静的なモジュール選択肢の構造
 */
export interface ModuleOption {
  moduleRarity: string; // レアリティカテゴリ (R, SR)
  weight: number; // 抽選に使われる重み (高いほど選ばれやすい)
}

/**
 * PlantTypeごとの静的設定（モジュール抽選時に使用）
 */
export interface PlantSetting {
  // partをキーとし、moduleTypeをキーとするModuleOptionの辞書
  modules: Record<string, Record<string, ModuleOption>>;
}

/**
 * Seedから出現する可能性のあるPlantTypeの選択肢
 */
export interface PlantOption {
  minSize: number;
  maxSize: number;
  rarity: string;
  weight: number; // 抽選に使われる重み
}

/**
 * SeedTypeごとの静的設定
 */
export interface SeedSetting {
  // plantTypeをキーとする辞書
  plants: Record<string, PlantOption>; // 抽選される可能性がある植物
}

interface ModuleItem {
  moduleType: string;
  moduleRarity: string;
  weight: number;
  zIndex: number;
  image_filename: string;
}

type Module = Record<string, ModuleItem[]>;
