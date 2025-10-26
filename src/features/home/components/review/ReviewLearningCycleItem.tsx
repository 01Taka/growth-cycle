import React from 'react';
import { Card, Flex, Image, Stack, Text } from '@mantine/core';
import StarEffect from '@/assets/images/star.png';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { AuraEffect } from './AuraEffect';
import { GiveWaterButton } from './GiveWaterButton';
import { ReviewLearningCycleItemProps } from './shared-types';
import { UnitPill } from './UnitPill';

export const ReviewLearningCycleItem: React.FC<ReviewLearningCycleItemProps> = ({
  isCompleted,
  plantIndex,
  subject,
  unitNames,
  testDurationMin,
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
        <Stack w={64} miw={64} style={{ position: 'relative' }}>
          {isCompleted && (
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                width: 70,
                height: 25,
                color: subjectTheme.text,
                background: subjectTheme.accent,
                position: 'absolute',
                borderRadius: 99,
                opacity: 0.8,
                zIndex: 2000,
                top: 50,
                left: -10,
              }}
            >
              完了
            </Text>
          )}

          <PlantImageItem
            subject={subject}
            type="adult"
            index={plantIndex}
            width={45}
            height={64}
            style={{ position: 'relative', zIndex: 1000 }}
          />
          {!isCompleted && (
            <AuraEffect
              color={subjectTheme.border}
              size={64}
              blurRadius={18}
              opacity={0.9}
              style={{ position: 'absolute', top: 0, left: -12, zIndex: 0 }}
            />
          )}
          {isCompleted && (
            <Image
              src={StarEffect}
              alt={'star'}
              fit="contain"
              style={{
                width: 80,
                height: 80,
                maxWidth: '100%',
                position: 'absolute',
                top: -15,
                left: -12,
                zIndex: 1000,
              }}
            />
          )}
        </Stack>

        {/* 右側のコンテンツエリア: flex: 1 で残りの幅を占有するように設定 */}
        <Stack flex={1} miw={0} gap={5}>
          {/* ユニットピルのコンテナを修正: 親の幅を超えないようにmaw="100%"を設定 */}
          <Flex w="100%" flex={1} style={{ overflow: 'auto' }}>
            {unitNames.map((unitName, index) => (
              <UnitPill
                key={index}
                subject={subject}
                unitName={unitName}
                disabled={isCompleted}
                size="lg"
              />
            ))}
          </Flex>
          {/* 目標時間とボタンのFlexコンテナ: 幅100%を確保し、中身を左右に配置 */}
          <Flex
            justify={'space-between'}
            align={'center'}
            style={{ marginLeft: 10 }}
            w="100%" // Stackの幅全体を使うように明示
          >
            <Text
              style={{
                color: isCompleted ? subjectTheme.disabledText : subjectTheme.text,
                // テキストが折り返さないように nowrap を適用（目標時間を保護）
                whiteSpace: 'nowrap',
              }}
            >
              目標: {testDurationMin}分
            </Text>
            <GiveWaterButton
              isCompleted={isCompleted}
              color={isCompleted ? subjectTheme.accent : subjectTheme.textRevers}
              bgColor={isCompleted ? subjectTheme.disabled : subjectTheme.accent}
              borderColor={isCompleted ? subjectTheme.accent : undefined}
            />
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
