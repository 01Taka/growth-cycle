// src/components/PlantImageDisplay.tsx (またはPlantImageItem.tsxをこれにリネーム)

import React from 'react';
import { Box, Center, Image, Loader, MantineStyleProp, Stack, Text } from '@mantine/core';
import ErrorPlantImage from '@/assets/images/default_plant.png'; // 外部画像
import { Subject } from '@/shared/types/subject-types';
import { DEFAULT_PLANTS_MAP } from '../default-plants'; // 外部データ

interface PlantImageDisplayProps {
  /** 外部から渡されるロード結果の画像URL (nullの場合はデフォルト画像を使う) */
  imageUrl: string | null;
  altText: string;
  /** 外部から渡されるローディング状態 */
  isLoading: boolean;
  /** 外部から渡されるロードエラー状態 */
  loadError: boolean;
  /** 教科名（altTextやデフォルト画像決定に使用） */
  subject: Subject;
  /** 画像が見つからない/エラー時に「Not Found/Load Failed」のオーバーレイを表示するか */
  displayNotFound?: boolean;
  /** コンポーネントの幅 */
  width?: number | string;
  /** 画像の高さ */
  height?: number | string;
  style?: MantineStyleProp;
}

/**
 * 画像URLと状態を受け取り、その表示のみを行うプレゼンテーションコンポーネント。
 */
export const PlantImageDisplay: React.FC<PlantImageDisplayProps> = ({
  imageUrl,
  altText,
  isLoading,
  loadError,
  subject,
  displayNotFound = false,
  width = 160,
  height = 160,
  style,
}) => {
  const isDefault = imageUrl === null;
  const defaultPlantImage = DEFAULT_PLANTS_MAP[subject];
  const finalImageSrc = imageUrl ?? defaultPlantImage;

  // 1. ロード中 (displayNotFoundがtrueの場合のみローダーを表示)
  if (isLoading && displayNotFound) {
    return (
      <Center style={{ height: height, width: width }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // 2. 致命的なエラー: 画像URLがなく、DefaultPlantImageも未定義の場合 (実質、loadError && isDefault)
  if (!finalImageSrc) {
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
        <Text c="red" ta="center">
          画像の読み込みに失敗しました。
        </Text>
      </Center>
    );
  }

  // 4. DefaultPlantImage の場合で、オーバーレイ表示が有効な場合
  if (displayNotFound && isDefault) {
    return (
      <Box
        style={{
          position: 'relative',
          width: width,
          height: height,
          border: '3px solid var(--mantine-color-gray-3)',
          ...style,
        }}
      >
        {/* ベースとなる画像 (DefaultPlantImage/ErrorPlantImage) */}
        <Image
          src={ErrorPlantImage} // URLがnullの場合、エラー時の共通デフォルト画像を表示
          alt={altText}
          height={height}
          fit="contain"
          style={{ width: '100%' }}
        />

        {/* 重ねる「Not Found/Load Failed」テキスト */}
        <Center
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 半透明のオーバーレイ
            pointerEvents: 'none',
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

  // 5. 通常の画像表示 (見つかったURLまたはオーバーレイ表示なしのデフォルト画像)
  return (
    <Image
      src={finalImageSrc}
      alt={altText}
      height={height}
      fit="contain"
      style={{ width: width, maxWidth: '100%', ...style }}
    />
  );
};
