import React from 'react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { Button, Flex, rem, RingProgress, Stack, Text } from '@mantine/core';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { processMilliseconds } from '@/shared/utils/datetime/time-utils';

interface StudyTimerProps {
  timer: SingleTimerData;
  switchState: () => void;
  title: string;
  sectionColor: string;
  buttonColor: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// sizeプロパティに応じたサイズ設定のマップ
const sizeMap = {
  xs: {
    ringSize: 150,
    thickness: 8,
    titleSize: 'sm',
    timeSize: rem(30),
    buttonMt: 2,
    buttonSize: 'xs',
  },
  sm: {
    ringSize: 200,
    thickness: 10,
    titleSize: 'lg',
    timeSize: rem(35),
    buttonMt: 8,
    buttonSize: 'xs',
  },
  md: {
    ringSize: 250,
    thickness: 12,
    titleSize: 'xl',
    timeSize: rem(45),
    buttonMt: 10,
    buttonSize: 'md',
  },
  lg: {
    ringSize: 350,
    thickness: 15,
    titleSize: 'xl',
    timeSize: rem(50),
    buttonMt: 20,
    buttonSize: 'lg',
  }, // 既存のデフォルトに近い設定
  xl: {
    ringSize: 450,
    thickness: 20,
    titleSize: rem(25),
    timeSize: rem(65),
    buttonMt: 30,
    buttonSize: 'xl',
  },
};

export const StudyTimer: React.FC<StudyTimerProps> = ({
  timer,
  switchState,
  title,
  sectionColor,
  buttonColor,
  size = 'lg',
}) => {
  const { remainingTime, progress, isRunning } = timer;

  // 選択されたサイズ設定を取得 (sizeがsizeMapのキーにない場合は'lg'をフォールバックとして使用)
  const currentSize = sizeMap[size] || sizeMap['lg'];

  const time = processMilliseconds(Math.ceil(remainingTime / 1000) * 1000);

  return (
    <Stack align="center">
      <RingProgress
        size={currentSize.ringSize}
        thickness={currentSize.thickness}
        roundCaps
        sections={[{ value: progress * 100, color: sectionColor }]}
        label={
          <Stack align="center" justify="end" gap={10} w={'100%'} h={'100%'}>
            <Text size={currentSize.titleSize}>{title}</Text>
            <Flex>
              {time.split.hours > 0 && (
                <Text size={currentSize.timeSize}>{time.split.hours}：</Text>
              )}
              <Text size={currentSize.timeSize}>{time.split.minutes}：</Text>
              <Text size={currentSize.timeSize}>{String(time.split.seconds).padStart(2, '0')}</Text>
            </Flex>
            <Button
              onClick={switchState}
              mt={currentSize.buttonMt}
              size={currentSize.buttonSize}
              style={{ backgroundColor: buttonColor }}
            >
              {isRunning ? <IconPlayerPause /> : <IconPlayerPlay />}
            </Button>
          </Stack>
        }
      />
    </Stack>
  );
};
