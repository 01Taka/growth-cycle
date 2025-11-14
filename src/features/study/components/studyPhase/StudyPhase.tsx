import React, { useState } from 'react';
import { Modal, Stack } from '@mantine/core';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { StudyHeader } from '../../../../shared/components/StudyHeader';
import { LearningProblemKeyList } from '../shared/problemList/LearningProblemKeyList';
import { StudyActionButtons } from './StudyActionButtons';
import { StudyPhasePlantDisplay } from './StudyPhasePlantDisplay';
import { StudyTimer } from './StudyTimer';

interface StudyPhaseProps {
  problems: ExpandedLearningCycleProblem[];
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
}

export const StudyPhase: React.FC<StudyPhaseProps> = ({
  problems,
  isReadyTest,
  header,
  plant,
  timer,
  theme,
  switchState,
  onStartTest,
}) => {
  const [showTestRange, setShowTestRange] = useState(false);

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
        onShowTextRange={() => setShowTestRange(true)}
      />
      {plant && <StudyPhasePlantDisplay subject={header.subject} plant={plant} />}
      <Modal
        opened={showTestRange}
        onClose={() => setShowTestRange(false)}
        styles={{
          root: { position: 'relative', borderRadius: 16 },
          header: { backgroundColor: theme.bgCard },
          body: { backgroundColor: theme.bgCard },
        }}
      >
        <LearningProblemKeyList problems={problems} theme={theme} />
      </Modal>
    </Stack>
  );
};
