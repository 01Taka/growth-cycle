import React from 'react';
import { Card, Flex, Stack, Text } from '@mantine/core';
import StarEffect from '@/assets/images/star.png';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { GiveWaterButton } from './GiveWaterButton';
import { UnitPill } from './UnitPill';

export interface ReviewLearningCycleItemProps {
  isCompleted: boolean;
  plant: Plant;
  subject: Subject;
  textbookName: string;
  unitNames: string[];
  problemCount: number;
  testDurationMin: number;
  onCheckDetail: () => void;
}

export const ReviewLearningCycleItem: React.FC<ReviewLearningCycleItemProps> = ({
  isCompleted,
  plant,
  subject,
  textbookName,
  unitNames,
  problemCount,
  testDurationMin,
  onCheckDetail,
}) => {
  const subjectTheme = useSubjectColorMap(subject);

  // Cardの幅をレスポンシブ対応（親要素に応じて最大幅100%）
  return (
    <Card
      w="100%" // 親要素に合わせて幅を100%に設定
      bg={isCompleted ? subjectTheme.disabled : subjectTheme.bgCard}
      radius={16}
      style={{
        border: isCompleted ? undefined : `3px solid ${subjectTheme.border}`,
      }}
    >
      <Flex gap={'xs'}>
        {/* 左側の画像エリア: 幅を固定値 (64px) に設定 */}
        <PlantWithEffect
          plant={plant}
          subject={subject}
          label={isCompleted ? '完了' : undefined}
          auraEffect={
            isCompleted
              ? undefined
              : {
                  blurRadius: 18,
                  opacity: 0.9,
                }
          }
          imagePath={isCompleted ? StarEffect : undefined}
        />

        {/* 右側のコンテンツエリア: flex: 1 で残りの幅を占有するように設定 */}
        <Stack
          flex={1}
          miw={0}
          gap={1}
          style={{
            color: isCompleted ? subjectTheme.disabledText : subjectTheme.text,
            whiteSpace: 'nowrap',
          }}
        >
          {/* ユニットピルのコンテナを修正: 親の幅を超えないようにmaw="100%"を設定 */}
          <Flex w="100%" flex={1} style={{ overflow: 'auto' }}>
            {unitNames.map((unitName, index) => (
              <UnitPill
                key={index}
                subject={subject}
                unitName={unitName}
                disabled={isCompleted}
                size="sm"
              />
            ))}
          </Flex>
          <Text>{textbookName}</Text>
          <Text>
            {problemCount}問 / 目標: {testDurationMin}分
          </Text>
        </Stack>
        <GiveWaterButton
          label={isCompleted ? '復習完了' : '内容確認'}
          labelColor={subjectTheme.text}
          isCompleted={isCompleted}
          color={isCompleted ? subjectTheme.accent : subjectTheme.textRevers}
          bgColor={isCompleted ? subjectTheme.disabled : subjectTheme.accent}
          borderColor={isCompleted ? subjectTheme.accent : undefined}
          onClick={onCheckDetail}
        />
      </Flex>
    </Card>
  );
};
