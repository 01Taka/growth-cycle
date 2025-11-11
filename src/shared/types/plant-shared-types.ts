import { z } from 'zod';

export const ImportPlantsTypeSchema = z.union([z.literal('adult'), z.literal('bud')]);

export type ImportPlantsType = z.infer<typeof ImportPlantsTypeSchema>;

// --- PlantModule スキーマ ---
/**
 * 植物を構成する個々のパーツ（モジュール）の定義
 * * Plant.modules 内では、part名はRecordのキーとして重複して格納されている
 */
export const PlantModuleSchema = z
  .object({
    part: z.string().describe('どの部位か ("stem", "flower"など)'),
    moduleType: z.string().describe('具体的なバリエーションID (例: "thick_v1")'),
    moduleRarity: z.string().describe('このモジュールのレアリティ (R, SRなど)'),
  })
  .describe('植物を構成する個々のパーツ（モジュール）の定義');

// --- Plant スキーマ ---
/**
 * 完全に成長した植物の個体データ
 */
export const PlantShapeSchema = z
  .object({
    seedType: z.string(),
    size: z
      .number()
      .positive() // sizeは正の整数を想定 (お好みで調整してください)
      .describe('植物の大きさ'),
    plantType: z.string(),
    plantRarity: z.string(),
    // PlantModuleを、part名をキーとして格納する辞書形式のレコード
    modules: z
      .record(z.string().nonempty(), PlantModuleSchema)
      .describe('part名をキーとするPlantModuleの辞書'),
  })
  .describe('完全に成長した植物の個体データ');

export const PlantSchema = PlantShapeSchema.and(
  z.object({
    currentStage: z.number().int().min(0).max(2),
    lastGrownAt: z.number(),
    textbookPositionX: z.number().min(0).max(1), // テキスト一覧での表示の際にどの位置に配置するか
  })
);

// 型の抽出
export type PlantModule = z.infer<typeof PlantModuleSchema>;
export type PlantShape = z.infer<typeof PlantShapeSchema>;
export type Plant = z.infer<typeof PlantSchema>;
