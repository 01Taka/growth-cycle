import React from 'react';
import { Stack } from '@mantine/core';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { ImportPlantsType, Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { StudyHeader } from '../main/StudyHeader';
import { StudyActionButtons } from './StudyActionButtons';
import { StudyPhasePlantDisplay } from './StudyPhasePlantDisplay';
import { StudyTimer } from './StudyTimer';

interface StudyPhaseProps {
  isReadyTest: boolean;
  header: {
    subject: Subject;
    textbookName: string;
    units: string[];
  };
  plant: Plant | null;
  timer: SingleTimerData;
  theme: SubjectColorMap;
  switchState: () => void;
  onStartTest: () => void;
  onShowTextRange: () => void;
}

export const StudyPhase: React.FC<StudyPhaseProps> = ({
  isReadyTest,
  header,
  plant,
  timer,
  theme,
  switchState,
  onStartTest,
  onShowTextRange,
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
      <StudyActionButtons
        theme={theme}
        isReadyTest={isReadyTest}
        onStartTest={onStartTest}
        onShowTextRange={onShowTextRange}
      />
      {plant && <StudyPhasePlantDisplay subject={header.subject} plant={plant} />}
    </Stack>
  );
};
