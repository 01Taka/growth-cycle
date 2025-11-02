import React, { useMemo } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { LocalStorageTimerPersistenceProvider } from '@/shared/hooks/timer/localStoragePersistenceProvider';
import { useTimer } from '@/shared/hooks/timer/useTimer';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { ParticleOverlay } from './ParticleOverlay';
import { StudyPhase } from './study/StudyPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const timerProvider = useMemo(() => new LocalStorageTimerPersistenceProvider(), []);
  const timer = useTimer({
    persistenceProvider: timerProvider,
    timerEndAction: 'stop',
    isDecreaseProgress: true,
    onTimerEnd: () => console.log('END'),
  });

  const subject: Subject = 'english';

  const theme = useSubjectColorMap(subject);

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack mt={16} style={{ backgroundColor: theme.bgScreen }}>
        <StudyPhase
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          timer={timer}
          theme={theme}
        />

        {/* テスト用 */}
        {/* <Flex>
          <Button onClick={timer.start}>start</Button>
          <Button onClick={timer.stop}>stop</Button>
          <Button onClick={timer.reset}>reset</Button>
          <TextInput
            type="number"
            // value={newExpectedDuration}
            // onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
          />
          <Button onClick={() => timer.setExpectedDuration(25 * 60 * 1000)}>更新</Button>
        </Flex> */}
      </Stack>
    </>
  );
};
