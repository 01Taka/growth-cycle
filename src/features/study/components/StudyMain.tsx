import React, { useMemo } from 'react';
import { Stack } from '@mantine/core';
import { LocalStorageMultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/localStoragePersistenceProvider';
import { useMultiTimer } from '@/shared/hooks/multi-timer/useMultiTimer';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { range } from '@/shared/utils/range';
import { ParticleOverlay } from './ParticleOverlay';
import { dummyProblems } from './testPhase/dummy-problems';
import { TestPhase } from './testPhase/TestPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const problems = dummyProblems;

  const timerProvider = useMemo(
    () => new LocalStorageMultiTimerPersistenceProvider('multiTimer'),
    []
  );
  const durationMap = useMemo(() => {
    const data = range(problems.length).map((index) => [`${index}`, Number.MAX_SAFE_INTEGER]);
    return Object.fromEntries(data);
  }, [problems.length]);

  const timer = useMultiTimer({
    initialDurationMap: { main: 25 * 60000, ...durationMap },
    initialStateMap: {},
    persistenceProvider: timerProvider,
  });

  const subject: Subject = 'english';

  const theme = useSubjectColorMap(subject);

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} style={{ backgroundColor: theme.bgScreen }}>
        {/* <StudyPhase
          isReadyTest={timer.remainingTime <= 0}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          timer={timer}
          theme={theme}
        /> */}

        <TestPhase
          problems={dummyProblems}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          mainTimer={timer.getSingleTimer('main')}
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
