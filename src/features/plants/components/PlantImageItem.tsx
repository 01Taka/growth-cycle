import React, { useEffect, useState } from 'react';
import { Box, Center, Image, Loader, MantineStyleProp, Stack, Text } from '@mantine/core';
import ErrorPlantImage from '@/assets/images/default_plant.png';
import { Subject } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { logger } from '@/shared/utils/logger';
import { usePlantImages } from '../context/PlantImagesContext';
import { DEFAULT_PLANTS_MAP } from '../default-plants';

interface PlantImageItemProps {
  /** 外部から渡されるロード対象の教科名 */
  subject: Subject;
  type: ImportPlantsType;
  /** 表示する画像のインデックス (0から始まる) */
  imageIndex: number;
  /** インデックスが画像の総数を超えた場合に、画像をループして表示するかどうか */
  displayNotFound?: boolean;
  isLoop?: boolean;
  /** コンポーネントの幅 */
  width?: number | string;
  /** 画像の高さ */
  height?: number | string;
  style?: MantineStyleProp;
}

/**
 * 指定されたsubjectとindexに基づき、画像を一つだけ表示する汎用コンポーネント。
 * エラー時や画像がない場合はDefaultPlantImageを表示し、その上に「Loading \n Failed」を重ねる。
 * getPlantImageByIndexPromise を使用し、必要な画像のみをロードするよう最適化。
 */
export const PlantImageItem: React.FC<PlantImageItemProps> = ({
  subject,
  type,
  imageIndex,
  displayNotFound = false,
  isLoop = false,
  width = 160,
  height = 160,
  style,
}) => {
  // Contextから必要な関数を両方取得
  const {
    getPlantImageByIndexPromise,
    getPlantImageByIndexFromCache,
    getPlantImageCountPromise,
    getPlantImageCountFromCache,
  } = usePlantImages();

  // 1. 状態の最適化: 全てのURL配列ではなく、表示すべきURLと総数のみを保持
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false); // 画像ロード失敗フラグ

  // 2. ロードロジックの改善: 必要な1枚のURLのみを非同期で取得
  useEffect(() => {
    let isMounted = true;

    // imageIndexとsubject/typeの組み合わせが変更されるたびに実行
    const loadSingleImage = async () => {
      if (!subject) return;

      if (isMounted) {
        setIsLoading(true);
        setLoadError(false);
        setImageUrl(null); // URLをリセット
      }

      try {
        // A. ループ処理のために画像総数を取得 (キャッシュから取得されることを期待)
        // getPlantImagesBySubject はキャッシュがあれば即座に返却するため、基本的に高速です。

        let total = getPlantImageCountFromCache(subject, type);
        if (total === null) {
          total = await getPlantImageCountPromise(subject, type);
        }

        if (isMounted) {
          setTotalImages(total);
        }

        // B. 有効なインデックスを計算
        let effectiveIndex = imageIndex;
        if (isLoop && total > 0) {
          // JavaScriptの % 演算子は負の数の場合に負の結果を返すため、カスタムモジュロを使う
          effectiveIndex = ((imageIndex % total) + total) % total;
        } else if (imageIndex < 0 || imageIndex >= total) {
          // ループしない場合でインデックスが無効なら、ロードを中止
          if (isMounted) {
            setIsLoading(false);
            // URLが null のままになる（DefaultImageが表示される）
          }
          return;
        }

        // C. 指定インデックスの画像URLを直接取得
        // この関数はキャッシュヒットを期待しますが、ない場合は自動でロードを実行します。
        let url = getPlantImageByIndexFromCache(subject, type, effectiveIndex);
        if (url === null) {
          url = await getPlantImageByIndexPromise(subject, type, effectiveIndex);
        }

        if (isMounted) {
          setImageUrl(url);
        }
      } catch (e) {
        logger.error(
          'Plant image loading failed (getPlantImageByIndexPromise/getPlantImagesBySubject):',
          e
        );
        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
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

  const isDefault = imageUrl === null;
  const defaultPlantImage = DEFAULT_PLANTS_MAP[subject];

  // 1. ロード中
  if (isLoading && displayNotFound) {
    return (
      <Center style={{ height: height, width: width }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // 2. 致命的なエラー: DefaultPlantImageも利用できない場合 (DefaultPlantImageはインポートされているので、実質 loadError の場合)
  if ((loadError && isDefault) || (!imageUrl && !defaultPlantImage)) {
    // 簡潔なエラーメッセージのみを返す
    return (
      <Center
        style={{
          height: height,
          width: width,
          border: '1px solid var(--mantine-color-red-6)',
          backgroundColor: 'var(--mantine-color-red-0)',
          borderRadius: 4,
        }}
      >
        <Text c="red">植物の画像の読み込みに失敗しました。</Text>
      </Center>
    );
  }

  // 3. 画像URLが見つかった、またはDefaultPlantImageを使う場合

  // 画像がロードされていない場合、totalImagesは0のまま。+1で1にならないよう、適切な値に調整。
  const displayIndex = isDefault
    ? imageIndex + 1 // デフォルト画像の場合、渡されたインデックスを表示
    : isLoop
      ? (imageIndex % (totalImages || 1)) + 1 // ループ計算後のインデックス
      : imageIndex + 1; // 通常のインデックス

  const altText = `${subject} ${displayIndex} ${isDefault ? '(Default/Not found)' : ''}`;

  if (displayNotFound && isDefault) {
    // DefaultPlantImage の場合、BoxとCenterでテキストを重ねる
    return (
      <Box
        style={{
          position: 'relative',
          width: width,
          height: height,
          border: '3px solid var(--mantine-color-gray-3)',
          ...style, // styleを適用
        }}
      >
        {/* ベースとなるDefaultPlantImage */}
        <Image
          src={ErrorPlantImage}
          alt={altText}
          height={height}
          fit="contain"
          style={{ width: '100%' }}
        />

        {/* 重ねる「Loading \n Failed」テキスト */}
        <Center
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 半透明のオーバーレイ
            pointerEvents: 'none', // クリックを下の画像に透過
          }}
        >
          <Stack align="center" gap={4}>
            <Text size="xl" fw={700} c="red" ta="center" style={{ lineHeight: 1 }}>
              {loadError ? 'Load Failed' : 'Not Found'}
            </Text>
            {loadError && (
              <Text size="sm" c="red" ta="center">
                Check Log
              </Text>
            )}
          </Stack>
        </Center>
      </Box>
    );
  }

  // 通常の画像の場合 (Imageコンポーネントのみを返す)
  return (
    <Image
      src={imageUrl ?? defaultPlantImage}
      color="green"
      alt={altText}
      height={height}
      fit="contain"
      style={{ width: width, maxWidth: '100%', ...style }}
    />
  );
};
