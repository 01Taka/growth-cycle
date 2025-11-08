import React from 'react';
import { Flex } from '@mantine/core';
import { Subject } from '@/shared/types/subject-types';
import { PlantImageItem } from '../../../plants/components/PlantImageItem';
import { TextbookPlant } from '../shared-props-types';

interface TextbookPlantsProps {
  subject: Subject;
  plants: TextbookPlant[];
  maxSize: number;
  widthPer: number;
  displayPlant: boolean;
  sizeRatio: number;
}

const TextbookPlants: React.FC<TextbookPlantsProps> = ({
  subject,
  plants,
  maxSize,
  widthPer,
  displayPlant,
  sizeRatio,
}) => {
  return (
    <Flex
      style={{
        position: 'relative',
        width: '100%',
        height: maxSize,
        transition: 'transform 0.5s ease-out', // 1秒間で滑らかに変化
        transform: `scale(${sizeRatio})`, // 倍率を適用
        transformOrigin: 'center bottom', // 中央を中心に拡大・縮小
      }}
    >
      {displayPlant &&
        plants.map((plant, index) => (
          <PlantImageItem
            key={index}
            type="adult"
            subject={subject}
            imageIndex={plant.plantIndex}
            width={plant.size}
            height={plant.size}
            style={{
              position: 'absolute',
              // positionX (0~1)をパーセンテージ (0%~100%) に変換して left に設定
              left: `${plant.positionX * widthPer}%`,
              bottom: 0,
            }}
          />
        ))}
    </Flex>
  );
};

export default TextbookPlants;
