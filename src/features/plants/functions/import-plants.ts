import { ImportPlantsType, ImportPlantsTypeSchema } from '@/shared/types/plant-shared-types';
import { Subject, SubjectSchema } from '@/shared/types/subject-types';
import { logger } from '@/shared/utils/logger';

// 🚨 Viteの静的インポート: すべての画像ファイルを事前に取得
const ALL_PLANT_IMAGE_IMPORTS = import.meta.glob('/src/assets/images/plants/**/*.png');

/**
 * PlantImageLoader
 * * 植物の画像ファイルをロードし、一度ロードした結果をキャッシュ（メモ化）するシングルトンクラス。
 * 画像のロードロジックとキャッシュ管理を一元化します。
 */
export class PlantImageLoader {
  /** シングルトンインスタンスを保持するプライベートな静的プロパティ */
  private static instance: PlantImageLoader;

  /** * キャッシュ機構: 一度ロードされた画像URLを格納するMap。
   * キーは `${type}/${subject}`、値は画像URLの配列 (string[])。
   */
  private imageCache = new Map<string, string[]>();

  private lengthCache = new Map<string, number>();

  /**
   * コンストラクタをプライベートにすることで、外部からの自由なインスタンス化を防ぎ、
   * シングルトンパターンを強制する。
   */
  private constructor() {}

  /**
   * シングルトンインスタンスを取得するための静的ファクトリメソッド。
   * インスタンスがまだ存在しない場合にのみ、新しいインスタンスを作成する。
   * @returns PlantImageLoaderのシングルトンインスタンス
   */
  public static getInstance(): PlantImageLoader {
    if (!PlantImageLoader.instance) {
      PlantImageLoader.instance = new PlantImageLoader();
    }
    return PlantImageLoader.instance;
  }

  /**
   * 検証済みの教科名に基づき、対応するディレクトリからすべての画像URLを非同期にロードする。
   * 初回ロード後はキャッシュに保存し、次回以降はキャッシュから即座に返す。
   * * @param subject ロード対象の教科名 (Zodで検証済み)
   * @param type プラントの種類（例: 'common', 'rare' など）
   * @returns 画像URLの配列
   */
  public async getPlantImagesBySubject(
    subject: Subject,
    type: ImportPlantsType
  ): Promise<string[]> {
    // 1. Zodによるランタイム検証
    ImportPlantsTypeSchema.parse(type);
    SubjectSchema.parse(subject);

    // キャッシュキーを生成
    const cacheKey = `${type}/${subject}`;

    // 2. キャッシュの確認 (メモ化)
    const cachedImages = this.imageCache.get(cacheKey);
    if (cachedImages) {
      return cachedImages;
    }

    // 3. 実行時フィルタリング用のプレフィックスを生成
    const subjectPrefix = `/src/assets/images/plants/${type}/${subject}/`;

    // フィルタリング後のインポート関数のみを抽出
    const subjectImageImports = Object.entries(ALL_PLANT_IMAGE_IMPORTS)
      .filter(([path]) => path.startsWith(subjectPrefix))
      .map(([, importFn]) => importFn);

    // 4. 画像のロードを並行して実行
    const imagePromise = subjectImageImports.map((importFn) => {
      // Viteのglobインポートの型をアサーション
      const typedImportFn = importFn as () => Promise<{ default: string }>;
      // インポート実行し、モジュールのデフォルトエクスポート (画像URL) を抽出
      return typedImportFn().then((mod) => mod.default);
    });

    const plants = await Promise.all(imagePromise);

    // 5. 結果をキャッシュに保存
    this.imageCache.set(cacheKey, plants);

    this.lengthCache.set(cacheKey, plants.length);

    return plants;
  }

  /**
   *  画像の総数を取得（キャッシュ優先）
   * キャッシュにない場合は、非同期ロードを実行して総数を取得する
   */
  public async getPlantImageCount(subject: Subject, type: ImportPlantsType): Promise<number> {
    const cachedLength = this.getPlantImageCountFromCache(subject, type);
    if (cachedLength !== null) {
      return cachedLength;
    }

    // 2. 長さキャッシュがない場合、画像ロードを実行して長さを取得
    // getPlantImagesBySubjectを呼び出すことで、内部で lengthCache も更新される
    const plants = await this.getPlantImagesBySubject(subject, type);

    return plants.length;
  }

  public getPlantImageCountFromCache(subject: Subject, type: ImportPlantsType): number | null {
    ImportPlantsTypeSchema.parse(type);
    SubjectSchema.parse(subject);

    const cacheKey = `${type}/${subject}`;

    // 1. 長さキャッシュを確認
    const cachedLength = this.lengthCache.get(cacheKey);
    if (cachedLength !== undefined) {
      return cachedLength;
    }

    return null;
  }

  /**
   * キャッシュ済みの画像配列から、特定のインデックスの画像URLを取得する。
   * キャッシュが存在しない場合は、自動的に画像をロード（非同期）してから取得を試みる。
   * * @param subject ロード対象の教科名 (Zodで検証済み)
   * @param type プラントの種類 "adult" | "bud"
   * @param index 取得したい画像のインデックス
   * @returns 対応する画像URL (string)
   * @throws {Error} インデックスが範囲外の場合、または画像ロードに失敗した場合
   */
  public async getPlantImageByIndex(
    subject: Subject,
    type: ImportPlantsType,
    index: number
  ): Promise<string> {
    // 1. Zodによるランタイム検証
    ImportPlantsTypeSchema.parse(type);
    SubjectSchema.parse(subject);

    const cacheKey = `${type}/${subject}`;
    let cachedImages = this.imageCache.get(cacheKey);

    // 2. キャッシュが存在しない場合、画像をロードする
    if (!cachedImages) {
      logger.info(`Cache miss for ${cacheKey} in getPlantImageByIndex. Initiating image load.`);
      try {
        // 非同期ロードを実行し、結果をキャッシュに格納（getPlantImagesBySubject内で処理済み）
        cachedImages = await this.getPlantImagesBySubject(subject, type);
      } catch (error) {
        // ロードに失敗した場合、エラーを再スロー
        const errorMessage = `Failed to load images for ${cacheKey} when accessing index ${index}.`;
        logger.error(errorMessage, error);
        throw new Error(errorMessage);
      }
    }

    if (!cachedImages) {
      const errorMessage = `Failed to cache images for ${cacheKey} when accessing index ${index}.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // 3. インデックスの検証と結果の返却
    if (index < 0 || index >= cachedImages.length) {
      const errorMessage = `Index ${index} is out of bounds for cache key ${cacheKey}. Array length: ${cachedImages!.length}.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return cachedImages[index];
  }

  public getPlantImageByIndexFromCache(
    subject: Subject,
    type: ImportPlantsType,
    index: number
  ): string | null {
    // 1. Zodによるランタイム検証
    ImportPlantsTypeSchema.parse(type);
    SubjectSchema.parse(subject);

    const cacheKey = `${type}/${subject}`;
    let cachedImages = this.imageCache.get(cacheKey);

    if (cachedImages) {
      if (index < 0 || index >= cachedImages.length) {
        const errorMessage = `Index ${index} is out of bounds for cache key ${cacheKey}. Array length: ${cachedImages!.length}.`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      return cachedImages[index];
    }

    return null;
  }
}

/**
 * 外部で利用する際に、毎回 `PlantImageLoader.getInstance()` を呼び出す手間を省くためのエクスポート。
 * これがこのモジュール全体で使われる単一のインスタンスとなる。
 */
export const plantImageLoader = PlantImageLoader.getInstance();
