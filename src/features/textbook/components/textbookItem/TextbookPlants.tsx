import React from 'react';
import { Flex } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { PlantImageItem } from '../../../plants/components/PlantImageItem';

interface TextbookPlantsProps {
  subject: Subject;
  plants: Plant[];
  maxSize: number;
  widthPer: number;
  displayPlant: boolean;
  plantSizeRatio: number;
  transformScale: number;
}

const TextbookPlants: React.FC<TextbookPlantsProps> = ({
  subject,
  plants,
  maxSize,
  widthPer,
  displayPlant,
  transformScale,
  plantSizeRatio,
}) => {
  return (
    <Flex
      style={{
        position: 'relative',
        width: '100%',
        height: maxSize,
        transition: 'transform 0.5s ease-out', // 1秒間で滑らかに変化
        transform: `scale(${transformScale})`, // 倍率を適用
        transformOrigin: 'center bottom', // 中央を中心に拡大・縮小
      }}
    >
      {displayPlant &&
        plants.map((plant, index) => (
          <PlantImageItem
            key={index}
            plant={plant}
            subject={subject}
            width={plant.size * plantSizeRatio}
            height={plant.size * plantSizeRatio}
            style={{
              position: 'absolute',
              // positionX (0~1)をパーセンテージ (0%~100%) に変換して left に設定
              left: `${plant.textbookPositionX * widthPer}%`,
              bottom: -5,
            }}
          />
        ))}
    </Flex>
  );
};

export default TextbookPlants;
