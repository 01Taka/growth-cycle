import React from 'react';
import { Image, MantineStyleProp, Stack, Text } from '@mantine/core';
import { AuraEffect } from '@/features/home/components/review/AuraEffect';
import { DirtMound } from '@/features/plants/components/DirtMound';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { UTIL_STYLES } from '@/shared/styles/shared-styles';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';
import { PlantImageItem } from './PlantImageItem';

interface PlantWithEffectProps {
  plant: Plant;
  subject: Subject;
  label?: string;
  imagePath?: string;
  auraEffect?: {
    blurRadius: number;
    opacity: number;
    style?: MantineStyleProp;
  };
  plantSize?: number;
  zIndex?: number;
}

export const PlantWithEffect: React.FC<PlantWithEffectProps> = ({
  plant,
  subject,
  label,
  imagePath,
  auraEffect,
  plantSize = 64,
  zIndex = 0,
}) => {
  const theme = useSubjectColorMap(subject);

  return (
    <Stack w={plantSize} miw={plantSize} align="center" style={{ position: 'relative' }}>
      {label && (
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            width: 70,
            height: 25,
            color: theme.text,
            background: toRGBA(theme.accent, 0.7),
            position: 'absolute',
            borderRadius: 99,
            opacity: 0.9,
            bottom: 0,
            zIndex: zIndex + 4,
          }}
        >
          {label}
        </Text>
      )}

      <PlantImageItem
        subject={subject}
        plant={plant}
        width={plantSize}
        height={plantSize}
        style={{
          ...UTIL_STYLES.absoluteCenter,
          zIndex: zIndex + 1,
        }}
      />
      <DirtMound
        size={plantSize}
        style={{
          ...UTIL_STYLES.absoluteCenter,
          top: undefined,
          bottom: -plantSize / 2 - 5,
          zIndex: zIndex + 2,
        }}
      />
      {auraEffect && (
        <AuraEffect
          color={theme.border}
          size={plantSize}
          blurRadius={auraEffect.blurRadius}
          opacity={auraEffect.opacity}
          style={{ ...UTIL_STYLES.absoluteCenter, ...auraEffect.style } as MantineStyleProp}
        />
      )}
      {imagePath && (
        <Image
          src={imagePath}
          alt={'star'}
          fit="contain"
          style={{
            ...UTIL_STYLES.absoluteCenter,
            width: plantSize,
            height: plantSize,
            zIndex: zIndex + 3,
          }}
        />
      )}
    </Stack>
  );
};
