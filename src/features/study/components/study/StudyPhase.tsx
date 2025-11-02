import React from 'react';
import { Button, Stack } from '@mantine/core';
import { UseTimerResult } from '@/shared/hooks/timer/timer-types';
import { sharedStyle } from '@/shared/styles/shared-styles';
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
  timer: UseTimerResult;
  theme: SubjectColorMap;
}

export const StudyPhase: React.FC<StudyPhaseProps> = ({
  isReadyTest,
  header,
  plant,
  timer,
  theme,
}) => {
  return (
    <Stack align="center">
      <StudyHeader {...header} />
      <StudyTimer timer={timer} sectionColor={theme.border} buttonColor={theme.accent} />

      <StudyActionButtons theme={theme} isReadyTest={isReadyTest} />
      <StudyPhasePlantDisplay {...plant} />
    </Stack>
  );
};
