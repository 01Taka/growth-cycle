import React from 'react';
import { Card, Flex, Stack, Text } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/study-shared-types';
import { AuraEffect } from './AuraEffect';
import { GiveWaterButton } from './GiveWaterButton';
import { UnitPill } from './UnitPill';

interface ReviewLearningCycleItemProps {
  isAchieved: boolean;
  plantIndex: number;
  subject: Subject;
  unitNames: string[];
  testDurationMin: number;
}

export const ReviewLearningCycleItem: React.FC<ReviewLearningCycleItemProps> = ({
  isAchieved,
  plantIndex,
  subject,
  unitNames,
  testDurationMin,
}) => {
  const subjectTheme = useSubjectColorMap(subject);

  return (
    <Card
      bg={isAchieved ? subjectTheme.disabled : subjectTheme.bgCard}
      radius={16}
      style={{
        border: isAchieved ? undefined : `3px solid ${subjectTheme.border}`,
      }}
    >
      <Flex gap={'xs'}>
        <Stack style={{ width: 64, position: 'relative' }}>
          {isAchieved && (
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
            index={plantIndex}
            width={45}
            height={64}
            style={{ position: 'relative', zIndex: 1000 }}
          />
          {!isAchieved && (
            <AuraEffect
              color={subjectTheme.border}
              size={64}
              blurRadius={18}
              opacity={0.9}
              style={{ position: 'absolute', top: 0, left: -12, zIndex: 0 }}
            />
          )}
        </Stack>

        <Stack gap={5}>
          <Flex style={{ overflow: 'auto' }}>
            {unitNames.map((unitName) => (
              <UnitPill subject={subject} unitName={unitName} disabled={isAchieved} size="lg" />
            ))}
          </Flex>
          <Flex justify={'space-between'} align={'center'} style={{ marginLeft: 10 }}>
            <Text style={{ color: isAchieved ? subjectTheme.disabledText : subjectTheme.text }}>
              目標: {testDurationMin}分
            </Text>
            <GiveWaterButton
              isAchieved={isAchieved}
              color={isAchieved ? subjectTheme.accent : subjectTheme.textRevers}
              bgColor={isAchieved ? subjectTheme.disabled : subjectTheme.accent}
              borderColor={isAchieved ? subjectTheme.accent : undefined}
            />
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};
