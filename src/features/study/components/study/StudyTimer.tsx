import React, { useMemo, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { Box, Button, Flex, rem, RingProgress, Stack, Text, TextInput } from '@mantine/core';
import { LocalStorageTimerPersistenceProvider } from '@/shared/hooks/timer/localStoragePersistenceProvider';
import { processMilliseconds } from '@/shared/hooks/timer/timer-utils';
import { useTimer } from '@/shared/hooks/timer/useTimer';

interface StudyTimerProps {
  /**
   * trueの場合、タイマーの進行と共にバーが増えていきます（充填）。
   * falseの場合、タイマーの進行と共にバーが減っていきます（空に）。
   */
  isFilling?: boolean;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ isFilling = false }) => {
  const timerProvider = useMemo(() => new LocalStorageTimerPersistenceProvider(), []);
  const {
    progress,
    remainingTime,
    isRunning,
    start,
    stop,
    reset,
    setExpectedDuration,
    switchState,
  } = useTimer({
    persistenceProvider: timerProvider,
    timerEndAction: 'stop',
    isDecreaseProgress: !isFilling,
    onTimerEnd: () => console.log('END'),
  });

  const time = processMilliseconds(Math.ceil(remainingTime / 1000) * 1000);

  const [newExpectedDuration, setNewExpectedDuration] = useState(20);

  return (
    <Stack align="center">
      <RingProgress
        size={350}
        thickness={15}
        roundCaps
        sections={[{ value: progress * 100, color: isFilling ? 'blue' : 'orange' }]}
        label={
          <Stack align="center" justify="end" gap={10} w={'100%'} h={'100%'}>
            <Text size="xl">テストまで</Text>
            <Flex>
              {time.split.hours > 0 && <Text size={rem(50)}>{time.split.hours}：</Text>}
              <Text size={rem(50)}>{time.split.minutes}：</Text>
              <Text size={rem(50)}>{time.split.seconds}</Text>
            </Flex>
            <Button onClick={switchState} mt={20}>
              {isRunning ? <IconPlayerPause /> : <IconPlayerPlay />}
            </Button>
          </Stack>
        }
      />

      {/* テスト用 */}
      <Flex>
        <Button onClick={start}>start</Button>
        <Button onClick={stop}>stop</Button>
        <Button onClick={reset}>reset</Button>
        <TextInput
          type="number"
          value={newExpectedDuration}
          onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
        />
        <Button onClick={() => setExpectedDuration(newExpectedDuration * 1000)}>更新</Button>
      </Flex>
    </Stack>
  );
};
