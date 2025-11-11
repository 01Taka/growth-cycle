// src/components/PlantImageItem.tsx (元のファイル)

import React from 'react';
import { MantineStyleProp, rem } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { usePlantImageLoader } from '../hooks/usePlantImageLoader';
import { PlantImageDisplay } from './PlantImageDisplay'; // 新しい表示コンポーネント

interface PlantImageItemProps {
  /** 外部から渡されるロード対象の教科名 */
  subject: Subject;
  plant: Plant;
  isLoop?: boolean;
  /** 画像が見つからない/エラー時に「Not Found/Load Failed」のオーバーレイを表示するか */
  displayNotFound?: boolean;
  /** コンポーネントの幅 */
  width?: number | `${string}%`;
  /** 画像の高さ */
  height?: number | `${string}%`;
  isRemSize?: boolean;
  style?: MantineStyleProp;
}

/**
 * 指定されたsubjectとindexに基づき、画像を一つだけ表示する汎用コンポーネント。
 * ロードロジック (usePlantImageLoader) と表示デザイン (PlantImageDisplay) を分離。
 */
export const PlantImageItem: React.FC<PlantImageItemProps> = ({
  subject,
  plant,
  isLoop = false,
  displayNotFound = false,
  width = 160,
  height = 160,
  isRemSize = false,
  style,
}) => {
  const type = (plant?.currentStage ?? 0) > 1 ? 'adult' : 'bud';

  const plantTypeValue = +plant?.plantType;

  const imageIndex = type === 'adult' ? (Number.isNaN(plantTypeValue) ? 0 : plantTypeValue) : 0;

  // ロジック層から画像の状態を取得
  const { imageUrl, isLoading, loadError } = usePlantImageLoader(subject, type, imageIndex, isLoop);

  const sizeRatio = type === 'adult' ? 1 : 0.7;
  const remSizeRatio = type === 'adult' ? 1 : 0.87;

  const isPercent = (value: number | `${string}%`): value is `${string}%` =>
    typeof value === 'string' && value.endsWith('%');

  // 幅と高さを計算するロジック
  const calculatedWidth = isPercent(width)
    ? width // % の場合はそのまま
    : isRemSize
      ? rem(width * remSizeRatio) // rem の場合は rem と ratio を適用
      : width * sizeRatio; // px/数値の場合は ratio を適用

  const calculatedHeight = isPercent(height)
    ? height // % の場合はそのまま
    : isRemSize
      ? rem(height * remSizeRatio) // rem の場合は rem と ratio を適用
      : height * sizeRatio; // px/数値の場合は ratio を適用

  // 表示層に全てを渡す
  return (
    <PlantImageDisplay
      imageUrl={imageUrl}
      altText="植物"
      isLoading={isLoading}
      loadError={loadError}
      subject={subject}
      displayNotFound={displayNotFound}
      width={calculatedWidth}
      height={calculatedHeight}
      style={style}
    />
  );
};
