import React from 'react';
import { Box, Card, Flex, rem, Stack, Text } from '@mantine/core';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { TEST_RESULT_COLOR } from '../../constants/test-result-constants';

interface ScoringSummaryProps {
  scoringCount: number;
  totalScoringNumber: number;
  correctCount: number;
  wrongCount: number;
  theme: SubjectColorMap;
}

export const ScoringSummary: React.FC<ScoringSummaryProps> = ({
  scoringCount,
  totalScoringNumber,
  correctCount,
  wrongCount,
  theme,
}) => {
  return (
    <Stack w={'80%'} gap={5}>
      <Text size={rem(15)} style={{ color: theme.text }}>
        採点概要
      </Text>
      <Card
        shadow="md"
        style={{
          borderRadius: 16,
          backgroundColor: theme.bgCard,
          border: `2px solid ${theme.border}`,
        }}
      >
        <Flex justify="space-around" style={{ color: theme.text }}>
          <Stack align="center" justify="center" gap={5}>
            <Text size={rem(15)}>採点状況</Text>
            <Text size={rem(24)} fw={700}>
              {scoringCount} / {totalScoringNumber}
            </Text>
          </Stack>
          <Flex gap={15}>
            <Stack
              align="center"
              justify="center"
              gap={5}
              style={{ color: TEST_RESULT_COLOR.correct.color }}
            >
              <Text size={rem(15)}>正解</Text>
              <Text size={rem(20)} fw={500}>
                {correctCount}
              </Text>
            </Stack>
            <Stack
              align="center"
              justify="center"
              gap={5}
              style={{ color: TEST_RESULT_COLOR.incorrect.color }}
            >
              <Text size={rem(15)}>間違い</Text>
              <Text size={rem(20)} fw={500}>
                {wrongCount}
              </Text>
            </Stack>
          </Flex>
        </Flex>
      </Card>
    </Stack>
  );
};
