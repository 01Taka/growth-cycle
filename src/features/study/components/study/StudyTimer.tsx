import React from 'react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { Button, Flex, rem, RingProgress, Stack, Text } from '@mantine/core';
import { UseTimerResult } from '@/shared/hooks/timer/timer-types';
import { processMilliseconds } from '@/shared/hooks/timer/timer-utils';

interface StudyTimerProps {
  timer: UseTimerResult;
  sectionColor: string;
  buttonColor: string;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ timer, sectionColor, buttonColor }) => {
  const { remainingTime, progress, isRunning, switchState } = timer;

  const time = processMilliseconds(Math.ceil(remainingTime / 1000) * 1000);

  return (
    <Stack align="center">
      <RingProgress
        size={350}
        thickness={15}
        roundCaps
        sections={[{ value: progress * 100, color: sectionColor }]}
        label={
          <Stack align="center" justify="end" gap={10} w={'100%'} h={'100%'}>
            <Text size="xl">テストまで</Text>
            <Flex>
              {time.split.hours > 0 && <Text size={rem(50)}>{time.split.hours}：</Text>}
              <Text size={rem(50)}>{time.split.minutes}：</Text>
              <Text size={rem(50)}>{String(time.split.seconds).padStart(2, '0')}</Text>
            </Flex>
            <Button onClick={switchState} mt={20} style={{ backgroundColor: buttonColor }}>
              {isRunning ? <IconPlayerPause /> : <IconPlayerPlay />}
            </Button>
          </Stack>
        }
      />
    </Stack>
  );
};
