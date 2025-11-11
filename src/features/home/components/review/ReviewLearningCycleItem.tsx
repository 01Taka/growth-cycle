import React from 'react';
import { Card, Flex, Image, MantineStyleProp, Overlay, Stack, Text } from '@mantine/core';
import StarEffect from '@/assets/images/star.png';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';
import { AuraEffect } from './AuraEffect';
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

const PLANT_SIZE = 64;

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

  const absoluteCenter: MantineStyleProp = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

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
        <Stack w={PLANT_SIZE} miw={PLANT_SIZE} align="center" style={{ position: 'relative' }}>
          {isCompleted && (
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                width: 70,
                height: 25,
                color: subjectTheme.text,
                background: toRGBA(subjectTheme.accent, 0.7),
                position: 'absolute',
                borderRadius: 99,
                opacity: 0.9,
                bottom: 0,
                zIndex: 3,
              }}
            >
              完了
            </Text>
          )}

          {/* PlantImageItem を Stack の中央に配置するため、Stack に align="center" を設定 */}
          <PlantImageItem
            subject={subject}
            plant={plant}
            width={PLANT_SIZE}
            height={PLANT_SIZE}
            style={{
              ...absoluteCenter,
              zIndex: 1,
            }}
          />
          {!isCompleted && (
            <AuraEffect
              color={subjectTheme.border}
              size={PLANT_SIZE}
              blurRadius={18}
              opacity={0.9}
              style={absoluteCenter}
            />
          )}
          {isCompleted && (
            <Image
              src={StarEffect}
              alt={'star'}
              fit="contain"
              style={{ ...absoluteCenter, width: PLANT_SIZE, height: PLANT_SIZE, zIndex: 2 }}
            />
          )}
        </Stack>

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
