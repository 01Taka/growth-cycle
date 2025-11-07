import React, { useState } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Box, Button, Flex, rem, Stack } from '@mantine/core'; // Boxコンポーネントを追加

import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';
import { ProblemAttemptDetail, ProblemScoringStatus } from '../../types/problem-types';
import { StudyHeader } from '../StudyHeader';
import { ScoringList } from './ScoringList';
import { ScoringSummary } from './ScoringSummary';

interface ScoringPhaseProps {
  problems: ProblemAttemptDetail[];
  header: { subject: Subject; textbookName: string; units: string[] };
  theme: SubjectColorMap;
  onStartReview: () => void;
}

export const ScoringPhase: React.FC<ScoringPhaseProps> = ({
  problems,
  header,
  theme,
  onStartReview,
}) => {
  const [scoringStatusMap, setScoringStatusMap] = useState<Record<number, ProblemScoringStatus>>(
    {}
  );
  const handleScoreChange = (
    problem: ProblemAttemptDetail,
    scoringStatus: ProblemScoringStatus
  ) => {
    setScoringStatusMap((prev) => ({
      ...prev,
      [problem.problemIndex]:
        prev[problem.problemIndex] === scoringStatus ? 'unrated' : scoringStatus,
    }));
  };

  const correctCount = Object.values(scoringStatusMap).filter(
    (status) => status === 'correct'
  ).length;
  const incorrectCount = Object.values(scoringStatusMap).filter(
    (status) => status === 'incorrect'
  ).length;
  const scoringCount = correctCount + incorrectCount;
  const isFilled = scoringCount === problems.length;

  return (
    <Stack
      align="center"
      gap="sm" // gapを少し小さくしてスペースを節約
      w={'100%'}
      h={'100vh'} // 親要素の高さを確定させ、Flexboxの計算を可能にする
      style={{
        overflow: 'hidden', // Stack内でコンテンツがはみ出すのを防ぐ
        position: 'relative',
      }}
    >
      <StudyHeader {...header} />

      <ScoringSummary
        scoringCount={scoringCount}
        totalScoringNumber={problems.length}
        correctCount={correctCount}
        wrongCount={incorrectCount}
        theme={theme}
      />

      {/* 2. ScoringListをBoxでラップし、残りのスペースをすべて消費させる */}
      <Box
        w="100%"
        flex={1} // **残りの垂直スペースを全て占有 (flex-grow: 1)**
        style={{
          overflowY: 'auto', // **内容がはみ出したら縦スクロールを有効にする**
          paddingBottom: '20px', // スクロール領域の最後に少しパディングを追加して見やすくする
        }}
      >
        <ScoringList
          problems={problems}
          scoringStatusMap={scoringStatusMap}
          bottomMargin={100}
          onScoreChange={handleScoreChange}
        />
      </Box>
      <Flex
        h={64}
        justify="center"
        align="center"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <Button
          w={'100%'}
          h={'90%'}
          color={isFilled ? theme.accent : toRGBA(theme.disabled, 0.8)}
          size={rem(20)}
          style={{
            ...(isFilled ? sharedStyle.button : sharedStyle.disabledButton),
            color: isFilled ? theme.text : theme.disabledText,
          }}
          onClick={onStartReview}
        >
          採点完了
          <IconCircleCheck />
        </Button>
      </Flex>
    </Stack>
  );
};
