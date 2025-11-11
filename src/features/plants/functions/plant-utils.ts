import { PlantModule, PlantShape } from '@/shared/types/plant-shared-types';
import { ModuleSetting, ModuleStructure, PlantConfigs } from '../types/plant-types';
import { loadConfigInstance } from './config-loader';
import { weightedRandomSelection } from './weighted-lottery-utils';

// --- 静的カタログの定義とテスト用モック ---

// グローバルなモジュール画像/ZIndexカタログ

/**
 * モジュールを一意に識別するためのグローバルキーを生成する。
 * @param struct モジュールを構成する要素
 * @returns 連結された大文字のキー文字列 (例: 'MATH_ROSEA_STEM_THICK_V1')
 */
const getModuleKey = ({ seedType, plantType, partType, moduleType }: ModuleStructure): string => {
  const keys = [seedType, plantType, partType, moduleType];
  return keys.map((key) => key.toUpperCase()).join('_');
};

/**
 * PlantSettingを参照するためのキーを生成する
 */
const getPlantKey = ({ seedType, plantType }: { seedType: string; plantType: string }): string => {
  const keys = [seedType, plantType];
  return keys.map((key) => key.toUpperCase()).join('_');
};

// --- メインロジック関数 ---

/**
 * Plantオブジェクトから、レンダリングに必要なすべてのモジュール設定（画像パス含む）を取得する。
 * Plantの動的情報（modules）と静的な設定（MODULE_SETTINGS）を結合する。
 * @param configs ロードされた設定データ
 * @param plant 完全なPlantオブジェクト
 * @param defaultImgPath デフォルトのプレースホルダー画像パス
 * @returns レンダリングに必要なModuleSettingオブジェクトの配列
 */
export const getModuleSettings = (
  configs: PlantConfigs,
  plant: PlantShape,
  defaultImgPath: string = ''
): (ModuleSetting & PlantModule)[] => {
  const MODULE_SETTINGS = configs.MODULE_SETTINGS;

  return Object.values(plant.modules).map((module) => {
    // 1. グローバルキーを生成
    const key = getModuleKey({
      seedType: plant.seedType,
      plantType: plant.plantType,
      partType: module.part,
      moduleType: module.moduleType,
    });

    // 2. モジュール設定カタログから静的情報を取得
    const setting = MODULE_SETTINGS[key];

    if (!setting) {
      console.error(`Error: Module setting not found for key: ${key}`);
      // デフォルトのプレースホルダーを返す
      return {
        ...module,
        imgPath: defaultImgPath,
        zIndex: 0,
      };
    }

    // 3. 取得した静的設定を返す（part情報も付けておく）
    return { ...module, ...setting };
  });
};

/**
 * 渡されたseedTypeに基づき、新しいPlantオブジェクトを生成する。
 * 2段階の重み付き抽選（PlantType -> Modules）を実行する。
 * @param configs ロードされた設定データ
 * @param seedType 使用する種のタイプ (例: 'math')
 * @returns 生成されたPlantオブジェクト、またはnull
 */
export const generatePlantShape = (
  configs: PlantConfigs, // 新しい引数
  seedType: string
): PlantShape | null => {
  const { SEED_SETTINGS, PLANT_SETTINGS, MODULE_SETTINGS } = configs;

  // 1. Seed設定の確認
  const seedSetting = SEED_SETTINGS[seedType];
  if (!seedSetting) {
    console.error(`Error: Seed setting not found for seedType: ${seedType}`);
    return null;
  }

  // 2. PlantTypeの抽選 (第1段階抽選)
  const plants = Object.entries(seedSetting.plants).map(([plantType, plant]) => ({
    plantType,
    ...plant,
  }));
  const plantOption = weightedRandomSelection(plants);

  if (!plantOption) {
    console.error(`Error: No plant option was selected for seedType: ${seedType}`);
    return null;
  }
  const plantType = plantOption.plantType;

  // 3. PlantType設定の確認
  const plantKey = getPlantKey({ seedType, plantType });
  const plantSetting = PLANT_SETTINGS[plantKey];

  if (!plantSetting) {
    console.error(`Error: Plant setting not found for plantKey: ${plantKey}`);
    return null;
  }

  // 4. 各Partのモジュール抽選とデータ構築 (第2段階抽選)
  const modules: Record<string, PlantModule> = {};
  let hasValidModules = false;

  for (const [part, options] of Object.entries(plantSetting.modules)) {
    // Partごとのモジュールを抽選
    const moduleData = Object.entries(options).map(([moduleType, data]) => ({
      moduleType,
      ...data,
    }));
    const option = weightedRandomSelection(moduleData);

    if (option) {
      // モジュールカタログキーを生成し、存在を確認
      const moduleKey = getModuleKey({
        seedType,
        plantType,
        partType: part,
        moduleType: option.moduleType,
      });

      if (MODULE_SETTINGS[moduleKey]) {
        // PlantModuleインターフェースに合わせてデータを整形
        modules[part] = {
          part,
          moduleType: option.moduleType,
          moduleRarity: option.moduleRarity,
        };
        hasValidModules = true;
      } else {
        console.warn(
          `Warning: Module setting missing for key: ${moduleKey}. Skipping part: ${part}`
        );
      }
    }
  }

  if (!hasValidModules) {
    console.error(`Error: Plant generated but contained no valid modules.`);
    return null;
  }

  // 5. サイズの決定
  // minSizeとmaxSizeはPlantOptionに含まれる
  const size =
    Math.floor(Math.random() * (plantOption.maxSize - plantOption.minSize + 1)) / 100 + // 100, 120 -> 1.00, 1.20
    plantOption.minSize / 100;

  // 6. 最終的なPlantオブジェクトの生成
  const plant: PlantShape = {
    size,
    seedType,
    plantType,
    plantRarity: plantOption.rarity,
    modules,
  };

  return plant;
};

const generatePlantShapeForMVP = () => {
  const MIN_SIZE = 80;
  const MAX_SIZE = 120;
  const MAX_INDEX = 16;
  const SEED_TYPE = 'mvpSeed';

  const size =
    Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1)) / 100 + // 100, 120 -> 1.00, 1.20
    MIN_SIZE / 100;

  const plantIndex = Math.floor(Math.random() * (MAX_INDEX + 1));

  const plant: PlantShape = {
    size,
    seedType: SEED_TYPE,
    plantType: plantIndex.toString(),
    plantRarity: '',
    modules: {},
  };
  return plant;
};

export const generatePlantShapeWithConfigLoad = async (_seedType: string) => {
  // TODO
  // 本番環境では切り替える
  // const config = await loadConfigInstance();
  // return generatePlantShape(config, seedType);
  return generatePlantShapeForMVP();
};
