import React from 'react';
import { Box, rem } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

interface StudyPlantProps {
  subject: Subject | null;
  type: ImportPlantsType;
  index: number;
  width?: number; // 全体の幅を制御するためのオプション
}

export const StudyPlant: React.FC<StudyPlantProps> = ({
  subject,
  type,
  index,
  width = 60, // デフォルトの幅を設定 (rem単位で使うため数値)
}) => {
  // 土台の幅を rem 単位に変換
  const soilWidth = rem(width);
  // 土の色（Mantineのオレンジ系を土の色として仮定）
  const soilColor = 'var(--mantine-color-orange-8)';
  // 土台の高さ
  const soilHeight = rem(8);

  return (
    // PlantImageItemと土台をStackで縦に配置
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: soilWidth,
      }}
    >
      {/* 1. PlantImageItem (双葉) */}
      <Box style={{ width: soilWidth, height: soilWidth }}>
        {subject && (
          <PlantImageItem
            subject={subject}
            type={type}
            index={index}
            width={soilWidth}
            height={soilWidth}
          />
        )}
      </Box>

      {/* 2. 土台 (Box) */}
      <Box
        style={{
          width: soilWidth,
          height: soilHeight,
          borderRadius: rem(4), // 角を丸くする
          backgroundColor: soilColor,
          // 土台と双葉が重なるように、土台を少し上にずらす
          marginTop: rem(-5),
          zIndex: 1, // 双葉よりも手前に見せることも可能ですが、ここではシンプルに
        }}
      />
    </Box>
  );
};
