import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Box, Button, Flex, rem, Stack, Text } from '@mantine/core'; // Boxコンポーネントを追加

import { ProblemScoringStatus } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';
import { StudyHeader } from '../../../../shared/components/StudyHeader';
import { ProblemAttemptDetail } from '../../types/problem-types';
import { ScoringList } from './ScoringList';
import { ScoringSummary } from './ScoringSummary';

interface ScoringPhaseProps {
  scoringStatusMap: Record<number, ProblemScoringStatus>;
  problems: ProblemAttemptDetail[];
  header: { subject: Subject; textbookName: string; units: string[] };
  theme: SubjectColorMap;
  handleScoreChange: (problem: ProblemAttemptDetail, scoringStatus: ProblemScoringStatus) => void;
  onStartReview: () => void;
}

export const ScoringPhase: React.FC<ScoringPhaseProps> = ({
  scoringStatusMap,
  problems,
  header,
  theme,
  handleScoreChange,
  onStartReview,
}) => {
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
      <Button
        h={64}
        color={isFilled ? theme.accent : toRGBA(theme.disabled, 0.95)}
        size={rem(20)}
        style={{
          ...(isFilled ? sharedStyle.button : sharedStyle.disabledButton),
          position: 'fixed',
          bottom: 5,
          right: 5,
          left: 5,
          color: theme.text,
        }}
        onClick={onStartReview}
      >
        {isFilled ? (
          <Flex gap={2} align="center">
            見直しを始める
            <IconSearch />
          </Flex>
        ) : (
          <Text size={rem(18)}>{`採点中... (残り${problems.length - scoringCount}つ)`}</Text>
        )}
      </Button>
    </Stack>
  );
};
