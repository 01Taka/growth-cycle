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
import { GroupedByIndexTestResult } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { REVIEW_NECESSITY_REASON_LABELS } from '@/features/app/review-necessity/constants/review-necessity-reason-label';
import { ReviewNecessityResultWithGroup } from '@/features/app/review-necessity/types/review-necessity-types';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { formatMillisecondsToMSS } from '@/shared/utils/datetime/time-utils';
import { range } from '@/shared/utils/range';
import { REVIEW_NECESSITY_COLORS } from '../../constants/review-necessity-constants';
import { formatMsToDaysAgo } from '../../functions/review-phase-utils';
import { getScoringStatusIcon, getSelfEvaluationIcon } from './icons';

interface RecordReviewCardProps {
  groupedTestResult: GroupedByIndexTestResult;
  problems: any[];
  higherLevelNecessity: ReviewNecessityResultWithGroup;
}

export const RecordReviewCard: React.FC<RecordReviewCardProps> = ({
  groupedTestResult,
  problems,
  higherLevelNecessity,
}) => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  const getTheme = (necessity: ReviewNecessityResultWithGroup) =>
    REVIEW_NECESSITY_COLORS[colorScheme][necessity.level];
  const getLabel = (necessity: ReviewNecessityResultWithGroup) =>
    REVIEW_NECESSITY_REASON_LABELS[necessity.reason];

  const theme = REVIEW_NECESSITY_COLORS[colorScheme][higherLevelNecessity.level];
  const lastProblem = problems[problems.length - 1];

  return (
    <Card
      shadow="md"
      style={{
        borderRadius: 16,
        backgroundColor: theme.background,
        border: `2px solid ${theme.border}`,
      }}
    >
      <Flex align="center" gap={10}>
        <Text size="xl" m={5}>
          {groupedTestResult.problemIndex + 1}
        </Text>
        <Stack gap={0}>
          <Text fw={500} size="sm">
            {groupedTestResult.unit?.name}
          </Text>
          <Text fw={700} size="md">
            {groupedTestResult.category?.name} {groupedTestResult.problemNumber}
          </Text>
        </Stack>
        <Box ml={'auto'}>
          <Pill
            size="lg"
            styles={{
              label: {
                color: theme.reverseText,
              },
              root: { backgroundColor: theme.accent },
            }}
          >
            {getLabel(higherLevelNecessity)}
          </Pill>
        </Box>
      </Flex>
      <Table
        style={{
          tableLayout: 'fixed',
          marginTop: 10,
        }}
        styles={{
          table: {
            border: `2px solid ${getTheme(higherLevelNecessity).border}`,
            backgroundColor: getTheme(higherLevelNecessity).background,
          },
        }}
      >
        <Table.Tbody>
          {/* 1行目: 日付 (日付は文字列のまま) */}
          <Table.Tr>
            <Table.Th style={{ width: '80px' }}>日付</Table.Th>
            {problems.map((problem, index) => {
              return (
                <Table.Td
                  key={`date-${index}`}
                  style={{
                    textAlign: 'center',
                    backgroundColor: getTheme(problem.higherLevelNecessity).background,
                  }}
                >
                  {problem ? formatMsToDaysAgo(problem.attemptAt) : ''}
                </Table.Td>
              );
            })}
          </Table.Tr>

          {/* 2行目: 正誤 (アイコン化) */}
          <Table.Tr>
            <Table.Th>正誤</Table.Th>
            {problems.map((problem, index) => {
              // 'unrated' ではない場合にアイコンを取得
              const status = problem?.scoringStatus || 'unrated';
              const { icon: Icon, color } = getScoringStatusIcon(status);
              return (
                <Table.Td
                  key={`score-${index}`}
                  style={{
                    textAlign: 'center',
                    backgroundColor: getTheme(problem.higherLevelNecessity).background,
                  }}
                >
                  {problem ? (
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
            {problems.map((problem, index) => {
              // null の場合は自己評価も 'unrated' として扱う
              const evaluation: TestSelfEvaluation =
                problem?.scoringStatus !== 'unrated' && problem?.selfEvaluation
                  ? problem.selfEvaluation
                  : 'unrated';

              // unrated は problem が null の場合や scoringStatus が unrated の場合にも適用される
              const { icon: Icon, color } = getSelfEvaluationIcon(evaluation);

              return (
                <Table.Td
                  key={`eval-${index}`}
                  style={{
                    textAlign: 'center',
                    backgroundColor: getTheme(problem.necessity)?.background,
                  }}
                >
                  {/* problem が null の場合は表示しない。それ以外はアイコンを表示。 */}
                  {problem ? (
                    <Text style={{ color }}>
                      {/* scoringStatus が 'unrated' の場合は空文字を表示する、という元のロジックを尊重する場合: */}
                      {problem.scoringStatus !== 'unrated' ? <Icon size={20} /> : ''}
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
              );
            })}
          </Table.Tr>

          <Table.Tr>
            <Table.Th>時間</Table.Th>
            {problems.map((problem, index) => {
              return (
                <Table.Td key={`eval-${index}`} style={{ textAlign: 'center' }}>
                  {/* problem が null の場合は表示しない。それ以外はアイコンを表示。 */}
                  {problem ? (
                    <Text>
                      {/* scoringStatus が 'unrated' の場合は空文字を表示する、という元のロジックを尊重する場合: */}
                      {`${formatMillisecondsToMSS(problem.timeSpentMs)}`}
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
      <Flex gap={5} mt={5}>
        {lastProblem.necessity.level > 0 && (
          <Text style={{ color: getTheme(lastProblem.necessity).text }}>
            ・{getLabel(lastProblem.necessity)}
          </Text>
        )}
        {groupedTestResult.groupNecessity.level > 0 &&
          groupedTestResult.groupNecessity.reason !== 'failedLatestAttempt' && (
            <Text style={{ color: getTheme(groupedTestResult.groupNecessity).text }}>
              ・{getLabel(groupedTestResult.groupNecessity)}
            </Text>
          )}
      </Flex>
    </Card>
  );
};
