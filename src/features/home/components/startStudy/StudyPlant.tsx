import React from 'react';
import { Box, Flex, rem } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

interface StudyPlantProps {
  learning: { subject: Subject; plant: Plant } | null;
  width?: number; // 全体の幅を制御するためのオプション
}

export const StudyPlant: React.FC<StudyPlantProps> = ({
  learning,
  width = 46, // デフォルトの幅を設定 (rem単位で使うため数値)
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: soilWidth,
      }}
    >
      {/* 1. PlantImageItem (双葉) */}
      <Flex align="end" style={{ width: soilWidth, height: soilWidth, position: 'relative' }}>
        {learning && (
          <PlantImageItem
            subject={learning.subject}
            plant={learning.plant}
            width={'100%'}
            height={'100%'}
            isRemSize={true}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
      </Flex>

      {/* 2. 土台 (Box) */}
      <Box
        style={{
          width: soilWidth,
          height: soilHeight,
          borderRadius: rem(4), // 角を丸くする
          backgroundColor: soilColor,
          zIndex: 1, // 双葉よりも手前に見せることも可能ですが、ここではシンプルに
          position: 'absolute',
          bottom: 5,
        }}
      />
    </Box>
  );
};
