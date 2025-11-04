import React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react'; // アイコンを追加
import { Button, Card, Flex, Group, Stack, Text } from '@mantine/core';
import { ScoringStatus, TestProblemAttemptResult } from '../../types/problem-types';

interface ScoringItemProps {
  problem: TestProblemAttemptResult;
  scoringStatus: ScoringStatus;
  onScoreChange: (scoringStatus: ScoringStatus) => void;
}

export const ScoringItem: React.FC<ScoringItemProps> = ({
  problem,
  scoringStatus,
  onScoreChange,
}) => {
  // Mantineの組み込みカラー（green, red）を例として使用します。
  // 実際のTEST_RESULT_COLORの定義に合わせて調整してください。
  const CORRECT_COLOR = 'green'; // 例: 正解は緑色
  const INCORRECT_COLOR = 'red'; // 例: 間違いは赤色

  return (
    <Card
      shadow="sm" // カードに影を追加して浮き上がらせる
      padding="lg"
      radius="md" // 角を丸くする
    >
      <Flex
        justify="space-between" // 両端に要素を配置
        align="center" // 垂直方向の中央揃え
        gap="md" // 要素間のスペース
      >
        {/* 1. 問題番号 */}
        <Text
          size="xl" // 大きめの文字サイズ
          fw={700} // 太字
          c="dimmed" // 色を薄くして強調しすぎないようにする
        >
          {problem.problemIndex + 1}
        </Text>

        {/* 2. 問題の詳細情報と自己評価 */}
        <Stack gap={4} style={{ flexGrow: 1 }}>
          {' '}
          {/* flexGrowで中央の要素にスペースを割く */}
          <Text size="md" fw={600}>
            {problem.unitName} {problem.categoryName} {problem.problemNumber}
          </Text>
          <Text
            size="sm"
            c="dimmed"
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {/* 自己評価のテキストが長い場合に備えて、折り返しを防ぎ、省略記号を追加 */}
            {problem.selfEvaluation}
          </Text>
        </Stack>

        {/* 3. 採点ボタン */}
        <Group gap="xs" wrap="nowrap">
          {' '}
          {/* ボタンをグループ化し、折り返しを防ぐ */}
          <Button
            size="md" // コンパクトなサイズ
            variant={scoringStatus === 'correct' ? 'filled' : 'outline'}
            color={CORRECT_COLOR} // 正解の色
            style={{ width: 88, height: 64, borderRadius: 8, padding: '8px 2px' }}
            onClick={() => onScoreChange('correct')}
          >
            {scoringStatus === 'correct' && <IconCheck size={20} />}
            正解
          </Button>
          <Button
            size="md"
            variant={scoringStatus === 'incorrect' ? 'filled' : 'outline'}
            color={INCORRECT_COLOR} // 間違いの色
            style={{ width: 88, height: 64, borderRadius: 8, padding: '8px 2px' }}
            onClick={() => onScoreChange('incorrect')}
          >
            {scoringStatus === 'incorrect' && <IconX size={20} />}
            間違い
          </Button>
        </Group>
      </Flex>
    </Card>
  );
};
