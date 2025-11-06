import React from 'react';
import {
  Box,
  Card,
  Flex,
  MantineColorScheme,
  Pill,
  Stack,
  Table,
  Text,
  useComputedColorScheme,
} from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ReviewNecessityColors } from '../../constants/review-necessity-constants';
import {
  calculateReviewNecessityFromLatestAttempt,
  determineFinalReviewNecessity,
} from '../../functions/calculate-review-necessity';
import { formatTimestampToDaysAgo, getJustBeforeLogs } from '../../functions/review-phase-utils';
import { useReviewNecessityColors } from '../../hooks/useReviewNecessityColors';
import { ProblemLearningRecord } from '../../types/problem-types';
import { getScoringStatusIcon, getSelfEvaluationIcon } from './icons';

// getRows 関数は削除します。

interface RecordReviewCardProps {
  record: ProblemLearningRecord;
}

export const RecordReviewCard: React.FC<RecordReviewCardProps> = ({ record }) => {
  const logs = getJustBeforeLogs(record);
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  const scores = determineFinalReviewNecessity(logs);
  const isTwoMoreNecessity = scores.latestAttemptNecessity < scores.recentWeightedNecessity;
  const theme = useReviewNecessityColors(scores);

  return (
    <Card
      shadow="md"
      style={{
        borderRadius: 16,
        backgroundColor: theme.reviewNecessity.backgroundColor,
        border: `2px solid ${theme.reviewNecessity.borderColor}`,
      }}
    >
      <Flex align="center" gap={10}>
        <Text size="xl" m={5}>
          {record.problemIndex + 1}
        </Text>
        <Stack gap={0}>
          <Text fw={500} size="sm">
            {record.unitName}
          </Text>
          <Text fw={700} size="md">
            {record.categoryName} {record.problemNumber}
          </Text>
        </Stack>
        <Box ml={'auto'}>
          <Pill
            size="lg"
            styles={{
              label: {
                color: theme.reviewNecessity.reverseTextColor,
              },
              root: { backgroundColor: theme.reviewNecessity.accentColor },
            }}
          >
            {theme.reviewNecessity.label}
          </Pill>
        </Box>
      </Flex>
      <Table
        style={{
          tableLayout: 'fixed',
          marginTop: 10,
        }}
        styles={{
          table: isTwoMoreNecessity
            ? {
                border: `2px solid ${theme.recentWeightedNecessity.borderColor}`,
                backgroundColor: theme.recentWeightedNecessity.backgroundColor,
              }
            : {},
        }}
      >
        <Table.Tbody>
          {/* 1行目: 日付 (日付は文字列のまま) */}
          <Table.Tr>
            <Table.Th style={{ width: '80px' }}>日付</Table.Th>
            {logs.map((log, index) => {
              const colNecessity = log ? calculateReviewNecessityFromLatestAttempt(log) : 0;
              const necessityColor = ReviewNecessityColors[colorScheme][colNecessity];
              return (
                <Table.Td
                  key={`date-${index}`}
                  style={{ textAlign: 'center', backgroundColor: necessityColor.backgroundColor }}
                >
                  {log ? formatTimestampToDaysAgo(log.attemptAt) : ''}
                </Table.Td>
              );
            })}
          </Table.Tr>

          {/* 2行目: 正誤 (アイコン化) */}
          <Table.Tr>
            <Table.Th>正誤</Table.Th>
            {logs.map((log, index) => {
              // 'unrated' ではない場合にアイコンを取得
              const status = log?.scoringStatus || 'unrated';
              const { icon: Icon, color } = getScoringStatusIcon(status);
              const colNecessity = log ? calculateReviewNecessityFromLatestAttempt(log) : 0;
              const necessityColor = ReviewNecessityColors[colorScheme][colNecessity];

              return (
                <Table.Td
                  key={`score-${index}`}
                  style={{ textAlign: 'center', backgroundColor: necessityColor?.backgroundColor }}
                >
                  {log ? (
                    <Text style={{ color }}>
                      <Icon size={20} />
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
              );
            })}
          </Table.Tr>

          {/* 3行目: 自己評価 (アイコン化) */}
          <Table.Tr>
            <Table.Th>自己評価</Table.Th>
            {logs.map((log, index) => {
              // null の場合は自己評価も 'unrated' として扱う
              const evaluation: TestSelfEvaluation =
                log?.scoringStatus !== 'unrated' && log?.selfEvaluation
                  ? (log.selfEvaluation as TestSelfEvaluation)
                  : 'unrated';

              const colNecessity = log ? calculateReviewNecessityFromLatestAttempt(log) : 0;
              const necessityColor = ReviewNecessityColors[colorScheme][colNecessity];

              // unrated は log が null の場合や scoringStatus が unrated の場合にも適用される
              const { icon: Icon, color } = getSelfEvaluationIcon(evaluation);

              return (
                <Table.Td
                  key={`eval-${index}`}
                  style={{ textAlign: 'center', backgroundColor: necessityColor?.backgroundColor }}
                >
                  {/* log が null の場合は表示しない。それ以外はアイコンを表示。 */}
                  {log ? (
                    <Text style={{ color }}>
                      {/* scoringStatus が 'unrated' の場合は空文字を表示する、という元のロジックを尊重する場合: */}
                      {log.scoringStatus !== 'unrated' ? <Icon size={20} /> : ''}
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
              );
            })}
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
};
