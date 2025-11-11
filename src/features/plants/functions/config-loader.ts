import { PlantConfigs } from '../types/plant-types';

// ---------------------------
// 2. 設定データローダー (シングルトンパターン)
// ---------------------------

// ロードされた設定データを保持するプライベート変数 (キャッシュ)
let _configInstance: PlantConfigs | null = null;
// ロード中のPromiseを保持するプライベート変数 (二重ロードを防止)
let _configPromise: Promise<PlantConfigs> | null = null;

/**
 * 内部で設定ファイルを非同期でロードする関数。
 */
const _loadAllConfig = async (): Promise<PlantConfigs> => {
  // JSONファイルが配置されているパス。適宜修正してください。
  const basePath = '/assets/json/plantsConfig/';
  const configFiles = [
    { name: 'seeds', path: `${basePath}seeds_config.json` },
    { name: 'plants', path: `${basePath}plants_config.json` },
    { name: 'modules', path: `${basePath}modules_config.json` },
  ];

  console.log('Configuration loading initiated (first time or explicit load).');

  try {
    const promises = configFiles.map(async (file) => {
      const response = await fetch(file.path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${file.name}`);
      }
      return response.json();
    });

    const [seedsData, plantsData, modulesData] = await Promise.all(promises);

    console.log('All configurations loaded successfully and cached.');

    return {
      SEED_SETTINGS: seedsData,
      PLANT_SETTINGS: plantsData,
      MODULE_SETTINGS: modulesData,
    };
  } catch (error) {
    console.error('Failed to load configuration files:', error);
    // エラーが発生した場合、PromiseとInstanceをクリアして再試行を可能にする
    _configPromise = null;
    throw error;
  }
};

/**
 * すべての設定データインスタンスを取得するメイン関数。
 * 初回呼び出し時のみ非同期ロードを実行し、以降はキャッシュされたデータを返す。
 * @returns すべての設定データを含むPlantConfigsオブジェクトのPromise
 */
export const loadConfigInstance = async (): Promise<PlantConfigs> => {
  // 1. 既にロードが完了しているかチェック (キャッシュヒット)
  if (_configInstance) {
    console.log('Returning cached configuration instance.');
    return _configInstance;
  }

  // 2. ロード中かチェック (同時呼び出しによる二重ロードを防止)
  if (_configPromise) {
    console.log('Waiting for configuration loading to complete...');
    return _configPromise;
  }

  // 3. 新規ロードを開始
  _configPromise = _loadAllConfig();

  try {
    const configs = await _configPromise;
    // ロード成功後、インスタンスをキャッシュに保存
    _configInstance = configs;
    return configs;
  } finally {
    // ロード完了後、Promiseをクリア（エラー時も含む）
    if (!_configInstance) {
      _configPromise = null; // エラー時のみクリア
    }
  }
};
