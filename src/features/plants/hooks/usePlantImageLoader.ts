// src/hooks/usePlantImageLoader.ts

import { useEffect, useState } from 'react';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { logger } from '@/shared/utils/logger';
import { usePlantImages } from '../context/PlantImagesContext'; // 既存のコンテキスト

interface PlantImageState {
  imageUrl: string | null;
  totalImages: number;
  isLoading: boolean;
  loadError: boolean;
}

/**
 * 指定されたsubjectとindexに基づいて、植物画像のURLとメタ情報を取得・管理するカスタムフック。
 *
 * @param subject 教科名
 * @param type プラントタイプ
 * @param imageIndex 表示する画像のインデックス (0から始まる)
 * @param isLoop インデックスが総数を超えた場合にループするかどうか
 * @returns {PlantImageState} 画像URL、総数、ローディング状態、エラー状態
 */
export const usePlantImageLoader = (
  subject: Subject,
  type: ImportPlantsType,
  imageIndex: number,
  isLoop: boolean
): PlantImageState => {
  const {
    getPlantImageByIndexPromise,
    getPlantImageByIndexFromCache,
    getPlantImageCountPromise,
    getPlantImageCountFromCache,
  } = usePlantImages();

  const [state, setState] = useState<PlantImageState>({
    imageUrl: null,
    totalImages: 0,
    isLoading: false,
    loadError: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadSingleImage = async () => {
      if (!subject) return;

      if (isMounted) {
        // ロード開始: 状態をリセット
        setState((prev) => ({
          ...prev,
          isLoading: true,
          loadError: false,
          imageUrl: null, // URLをリセット
        }));
      }

      try {
        // A. 画像総数を取得 (キャッシュから取得を試みる)
        let total = getPlantImageCountFromCache(subject, type);
        if (total === null) {
          total = await getPlantImageCountPromise(subject, type);
        }

        if (isMounted) {
          setState((prev) => ({ ...prev, totalImages: total }));
        }

        // B. 有効なインデックスを計算
        let effectiveIndex = imageIndex;
        if (isLoop && total > 0) {
          // モジュロ演算
          effectiveIndex = ((imageIndex % total) + total) % total;
        } else if (imageIndex < 0 || imageIndex >= total) {
          // ループせず、インデックスが無効な場合はロードを中止 (URLはnullのまま)
          if (isMounted) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
          return;
        }

        // C. 指定インデックスの画像URLを直接取得
        let url = getPlantImageByIndexFromCache(subject, type, effectiveIndex);
        if (url === null) {
          url = await getPlantImageByIndexPromise(subject, type, effectiveIndex);
        }

        if (isMounted) {
          setState((prev) => ({ ...prev, imageUrl: url }));
        }
      } catch (e) {
        logger.error('Plant image loading failed in usePlantImageLoader:', e);
        if (isMounted) {
          setState((prev) => ({ ...prev, loadError: true }));
        }
      } finally {
        if (isMounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadSingleImage();

    return () => {
      isMounted = false;
    };
  }, [
    subject,
    type,
    imageIndex,
    isLoop,
    getPlantImageByIndexPromise,
    getPlantImageCountPromise,
    getPlantImageByIndexFromCache,
    getPlantImageCountFromCache,
  ]);

  return state;
};
