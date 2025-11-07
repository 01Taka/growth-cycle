import React from 'react';
import { Box, Card, Flex, Pill, Stack, Table, Text } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { formatMillisecondsToMSS } from '@/shared/utils/datetime/time-utils';
import { formatTimestampToDaysAgo, getJustBeforeLogs } from '../../functions/review-phase-utils';
import { useReviewNecessity } from '../../hooks/useReviewNecessity';
import { ProblemLearningRecord } from '../../types/problem-types';
import { getScoringStatusIcon, getSelfEvaluationIcon } from './icons';

// getRows 関数は削除します。

interface RecordReviewCardProps {
  record: ProblemLearningRecord;
}

export const RecordReviewCard: React.FC<RecordReviewCardProps> = ({ record }) => {
  const logs = getJustBeforeLogs(record);
  const necessity = useReviewNecessity(logs);
  const isTwoMoreNecessity =
    necessity.latestAttemptNecessity.level < necessity.recentWeightedNecessity.level;

  return (
    <Card
      shadow="md"
      style={{
        borderRadius: 16,
        backgroundColor: necessity.reviewNecessity.theme.backgroundColor,
        border: `2px solid ${necessity.reviewNecessity.theme.borderColor}`,
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
                color: necessity.reviewNecessity.theme.reverseTextColor,
              },
              root: { backgroundColor: necessity.reviewNecessity.theme.accentColor },
            }}
          >
            {necessity.reviewNecessity.label}
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
                border: `2px solid ${necessity.recentWeightedNecessity.theme.borderColor}`,
                backgroundColor: necessity.recentWeightedNecessity.theme.backgroundColor,
              }
            : {},
        }}
      >
        <Table.Tbody>
          {/* 1行目: 日付 (日付は文字列のまま) */}
          <Table.Tr>
            <Table.Th style={{ width: '80px' }}>日付</Table.Th>
            {logs.map((log, index) => {
              const necessityColor = necessity.getNecessityColor(log);
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
              const necessityColor = necessity.getNecessityColor(log);
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

              const necessityColor = necessity.getNecessityColor(log);

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

          <Table.Tr>
            <Table.Th>時間</Table.Th>
            {logs.map((log, index) => {
              return (
                <Table.Td key={`eval-${index}`} style={{ textAlign: 'center' }}>
                  {/* log が null の場合は表示しない。それ以外はアイコンを表示。 */}
                  {log ? (
                    <Text>
                      {/* scoringStatus が 'unrated' の場合は空文字を表示する、という元のロジックを尊重する場合: */}
                      {`${formatMillisecondsToMSS(log.timeSpentMs)}`}
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
        {necessity.latestAttemptNecessity.level > 0 && (
          <Text style={{ color: necessity.latestAttemptNecessity.theme.textColor }}>
            ・{necessity.latestAttemptNecessity.reasonLabel}
          </Text>
        )}
        {necessity.recentWeightedNecessity.level > 0 &&
          necessity.recentWeightedNecessity.reason !== 'latestHighNecessity' && (
            <Text style={{ color: necessity.recentWeightedNecessity.theme.textColor }}>
              ・{necessity.recentWeightedNecessity.reasonLabel}
            </Text>
          )}
      </Flex>
    </Card>
  );
};
