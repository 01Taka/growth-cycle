// src/components/PlantImageItem.tsx (元のファイル)

import React from 'react';
import { MantineStyleProp } from '@mantine/core';
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
  width?: number | string;
  /** 画像の高さ */
  height?: number | string;
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
  style,
}) => {
  const type = (plant?.currentStage ?? 0) > 0 ? 'adult' : 'bud';

  const plantTypeValue = +plant?.plantType;

  const imageIndex = Number.isNaN(plantTypeValue) ? 0 : plantTypeValue;

  // ロジック層から画像の状態を取得
  const { imageUrl, isLoading, loadError } = usePlantImageLoader(subject, type, imageIndex, isLoop);

  // 表示層に全てを渡す
  return (
    <PlantImageDisplay
      imageUrl={imageUrl}
      altText="植物"
      isLoading={isLoading}
      loadError={loadError}
      subject={subject}
      displayNotFound={displayNotFound}
      width={width}
      height={height}
      style={style}
    />
  );
};
