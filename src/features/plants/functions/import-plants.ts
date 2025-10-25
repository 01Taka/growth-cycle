// src/api/imageLoader.ts

// Subject型とSubjectSchemaは適切な場所からインポートしてください
import { Subject, SubjectSchema } from '@/types/study-shared-types';

// 🚨 Viteの静的インポート: すべての画像ファイルを事前に取得
const ALL_PLANT_IMAGE_IMPORTS = import.meta.glob('/src/assets/plants/**/*.png');

/**
 * 検証済みの教科名に基づき、対応するディレクトリからすべての画像URLを非同期にロードする。
 * @param subject ロード対象の教科名 (Zodで検証済み)
 * @returns 画像URLの配列
 */
export const getPlantImagesBySubject = async (subject: Subject): Promise<string[]> => {
  SubjectSchema.parse(subject); // 1. Zodによるランタイム検証

  // 2. 実行時フィルタリング用のプレフィックスを生成
  const subjectPrefix = `/src/assets/plants/${subject}/`;

  // フィルタリング後のインポート関数のみを抽出
  const subjectImageImports = Object.entries(ALL_PLANT_IMAGE_IMPORTS)
    .filter(([path]) => path.startsWith(subjectPrefix))
    .map(([, importFn]) => importFn);

  // 3. 画像のロードを並行して実行
  const imagePromise = subjectImageImports.map((importFn) => {
    const typedImportFn = importFn as () => Promise<{ default: string }>;
    return typedImportFn().then((mod) => mod.default);
  });

  const plants = await Promise.all(imagePromise);
  return plants;
};
