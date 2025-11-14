import React from 'react';
import { Button, Modal } from '@mantine/core';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { LearningProblemKeyList } from '@/features/study/components/shared/problemList/LearningProblemKeyList';
import { StudyHeader } from '@/shared/components/StudyHeader';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';

interface StartReviewModalProps {
  subject: Subject;
  textbookName: string;
  units: string[];
  opened: boolean;
  problems: ExpandedLearningCycleProblem[];
  onClose: () => void;
  onStartReview: () => void;
}

export const StartReviewModal: React.FC<StartReviewModalProps> = ({
  subject,
  textbookName,
  units,
  problems,
  opened,
  onClose,
  onStartReview,
}) => {
  const theme = useSubjectColorMap(subject);
  return (
    <Modal opened={opened} onClose={onClose}>
      <StudyHeader subject={subject} textbookName={textbookName} units={units} />
      <Button
        size="lg"
        fullWidth
        radius="lg"
        bg={theme.accent}
        c={theme.textRevers}
        style={{
          position: 'sticky',
          top: 60,
          zIndex: 1000,
          margin: '50px 0',
        }}
        onClick={onStartReview}
      >
        復習開始
      </Button>
      <LearningProblemKeyList problems={problems} theme={theme} headerTop={110} />
    </Modal>
  );
};
