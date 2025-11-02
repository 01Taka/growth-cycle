import React, { useMemo, useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { LocalStorageTimerPersistenceProvider } from '@/shared/hooks/timer/localStoragePersistenceProvider';
import { useTimer } from '@/shared/hooks/timer/useTimer';

interface StudyPhaseProps {}

export const StudyPhase: React.FC<StudyPhaseProps> = ({}) => {
  const timerProvider = useMemo(() => new LocalStorageTimerPersistenceProvider(), []);
  const { remainingTime, start, stop, reset, setExpectedDuration } = useTimer({
    initialState: { expectedDuration: 0.2 * 60000 },
    persistenceProvider: timerProvider,
    intervalMs: 100,
    onTimerEnd: () => console.log('END'),
  });

  const [time, setTime] = useState(20);

  return (
    <div>
      <h1>StudyPhaseContent: {remainingTime / 1000}</h1>
      <Button onClick={start}>start</Button>
      <Button onClick={stop}>stop</Button>
      <Button onClick={reset}>reset</Button>
      <TextInput type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
      <Button onClick={() => setExpectedDuration(time * 1000)}>更新</Button>
    </div>
  );
};
