import React, { useMemo, useState } from 'react';
import { Box, Stack } from '@mantine/core'; // Boxコンポーネントを追加
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';
import { ScoringStatus, TestProblemAttemptResult } from '../../types/problem-types';
import { generateDummyTestResults } from '../dummy-problems';
import { StudyHeader } from '../StudyHeader';
import { ScoringList } from './ScoringList';
import { ScoringSummary } from './ScoringSummary';

interface ScoringPhaseProps {
  problems: TestProblemAttemptResult[];
  header: { subject: Subject; textbookName: string; units: string[] };
  theme: SubjectColorMap;
}

export const ScoringPhase: React.FC<ScoringPhaseProps> = ({ problems, header, theme }) => {
  const [scoringStatusMap, setScoringStatusMap] = useState<Record<number, ScoringStatus>>({});
  const handleScoreChange = (problem: TestProblemAttemptResult, scoringStatus: ScoringStatus) => {
    setScoringStatusMap((prev) => ({ ...prev, [problem.problemIndex]: scoringStatus }));
  };

  const correctCount = Object.values(scoringStatusMap).filter(
    (status) => status === 'correct'
  ).length;
  const incorrectCount = Object.values(scoringStatusMap).filter(
    (status) => status === 'incorrect'
  ).length;

  return (
    <Stack
      align="center"
      gap="sm" // gapを少し小さくしてスペースを節約
      w={'100%'}
      h={'100vh'} // 親要素の高さを確定させ、Flexboxの計算を可能にする
      style={{
        overflow: 'hidden', // Stack内でコンテンツがはみ出すのを防ぐ
      }}
    >
      <StudyHeader {...header} />

      <ScoringSummary
        scoringCount={correctCount + incorrectCount}
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
          onScoreChange={handleScoreChange}
        />
      </Box>
    </Stack>
  );
};
