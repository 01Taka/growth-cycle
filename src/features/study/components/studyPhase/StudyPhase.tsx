import React from 'react';
import { Stack } from '@mantine/core';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { StudyActionButtons } from './StudyActionButtons';
import { StudyHeader } from './StudyHeader';
import { StudyPhasePlantDisplay } from './StudyPhasePlantDisplay';
import { StudyTimer } from './StudyTimer';

interface StudyPhaseProps {
  isReadyTest: boolean;
  header: {
    subject: Subject;
    textbookName: string;
    units: string[];
  };
  plant: {
    subject: Subject;
    type: ImportPlantsType;
    imageIndex: number;
  };
  timer: SingleTimerData;
  theme: SubjectColorMap;
  switchState: () => void;
}

export const StudyPhase: React.FC<StudyPhaseProps> = ({
  isReadyTest,
  header,
  plant,
  timer,
  theme,
  switchState,
}) => {
  return (
    <Stack align="center">
      <StudyHeader {...header} />
      <StudyTimer
        title="テストまで"
        timer={timer}
        sectionColor={theme.border}
        buttonColor={theme.accent}
        switchState={switchState}
      />
      <StudyActionButtons theme={theme} isReadyTest={isReadyTest} />
      <StudyPhasePlantDisplay {...plant} />
    </Stack>
  );
};
