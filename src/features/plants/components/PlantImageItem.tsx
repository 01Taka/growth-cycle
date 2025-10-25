// src/components/PlantImageItem.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Center, Image, Loader, Stack, Text } from '@mantine/core'; // Box, Stackを追加
import DefaultPlantImage from '@/assets/images/default_plant.png';
import { Subject } from '@/types/study-shared-types';
import { usePlantImages } from '../context/PlantImagesContext';

interface PlantImageItemProps {
  /** 外部から渡されるロード対象の教科名 */
  subject: Subject;
  /** 表示する画像のインデックス (0から始まる) */
  index: number;
  /** インデックスが画像の総数を超えた場合に、画像をループして表示するかどうか */
  isLoop?: boolean;
  /** コンポーネントの幅 */
  width?: number | string;
  /** 画像の高さ */
  height?: number | string;
}

/**
 * 指定されたsubjectとindexに基づき、画像を一つだけ表示する汎用コンポーネント。
 * エラー時や画像がない場合はDefaultPlantImageを表示し、その上に「Loading \n Failed」を重ねる。
 */
export const PlantImageItem: React.FC<PlantImageItemProps> = ({
  subject,
  index,
  isLoop = false,
  width = 160,
  height = 160,
}) => {
  const { getPlantImagesBySubject: fetchImages } = usePlantImages();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // subjectが変更されるたびに画像をロードするEffect
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      if (!subject) return;

      if (isMounted) {
        setIsLoading(true);
        setError(null);
        setImageUrls([]);
      }

      try {
        const urls = await fetchImages(subject);
        if (isMounted) {
          setImageUrls(urls);
        }
      } catch (e) {
        console.error('Primary image loading failed:', e);
        if (isMounted) {
          // エラーフラグをセット
          setError('ロード中にエラーが発生しました。');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [subject, fetchImages]);

  // 🎯 表示する画像のURLを計算
  const imageUrlToDisplay = useMemo(() => {
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
      // URLが見つからなかった場合はnull
      return null;
    }

    let effectiveIndex = index;

    if (isLoop) {
      effectiveIndex = index % totalImages;
    } else {
      if (index < 0 || index >= totalImages) {
        // インデックスが無効な場合はnull
        return null;
      }
    }

    return imageUrls[effectiveIndex];
  }, [imageUrls, index, isLoop]);

  // 最終的にImageコンポーネントに渡すURLを決定
  const finalImageUrl = imageUrlToDisplay || DefaultPlantImage;

  // UIのレンダリング

  // 1. ロード中
  if (isLoading) {
    return (
      <Center style={{ height: height, width: width }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // 2. 致命的なエラー: DefaultPlantImageも利用できない場合
  if (!finalImageUrl) {
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

  const isDefault = finalImageUrl === DefaultPlantImage;
  const displayIndex = isLoop ? (index % (imageUrls.length || 1)) + 1 : index + 1;
  const altText = `${subject} ${displayIndex} ${isDefault ? '(Default)' : ''}`;

  if (isDefault) {
    // DefaultPlantImage の場合、BoxとCenterでテキストを重ねる
    return (
      <Box
        style={{
          position: 'relative',
          width: width,
          height: height,
          border: '3px solid var(--mantine-color-gray-3)',
        }}
      >
        {/* ベースとなるDefaultPlantImage */}
        <Image
          src={DefaultPlantImage}
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
          <Stack align="center">
            <Text size="xl" fw={700} c="red" ta="center" style={{ lineHeight: 1 }}>
              Loading
            </Text>
            <Text size="xl" fw={700} c="red" ta="center" style={{ lineHeight: 1 }}>
              Failed
            </Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  // 通常の画像の場合 (Imageコンポーネントのみを返す)
  return (
    <Image
      src={finalImageUrl}
      alt={altText}
      height={height}
      fit="contain"
      style={{ width: width, maxWidth: '100%' }}
    />
  );
};
