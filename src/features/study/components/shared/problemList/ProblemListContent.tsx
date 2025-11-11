import React from 'react';
import { IconBook } from '@tabler/icons-react';
import { Flex, Group, Paper, rem, Stack, Text } from '@mantine/core';
import { LearningProblemKey } from '@/features/study/types/problem-types'; // 型のインポート
import { SubjectColorMap } from '@/shared/theme/subjectColorType';

interface ProblemListContentProps {
  // グループ化されたデータではなく、フィルター済みの平坦なリストを受け取る
  filteredProblems: LearningProblemKey[];
  theme: SubjectColorMap;
}

export const ProblemListContent: React.FC<ProblemListContentProps> = ({
  filteredProblems,
  theme,
}) => {
  if (filteredProblems.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder ta="center">
        <Text c="dimmed" size="sm">
          該当する問題が見つかりません
        </Text>
      </Paper>
    );
  }

  // 以前のユニット名を保持し、ユニットの変わり目でヘッダーを表示するための変数
  let previousUnitName: string | null = null;

  return (
    <Stack gap="xs">
      {/* 問題間のギャップを調整 */}
      {filteredProblems.map((problem, idx) => {
        const isNewUnit = problem.unitName !== previousUnitName;
        previousUnitName = problem.unitName; // ユニット名を更新

        return (
          <React.Fragment key={idx}>
            {/* ユニットが変わる場合にのみヘッダーを表示 */}
            {isNewUnit && (
              <Paper
                key={`unit-header-${problem.unitName}-${idx}`}
                withBorder
                p="xs"
                bg={theme.bgChip}
                style={{ marginTop: idx === 0 ? 0 : '16px' }}
              >
                <Flex align="center" gap="xs">
                  <IconBook size={16} />
                  <Text fw={600} size="sm">
                    {problem.unitName}
                  </Text>
                  {/* ユニット内の問題数を表示する場合は、ここで計算するか、別のプロップとして渡す必要がありますが、簡略化のため省略 */}
                </Flex>
              </Paper>
            )}

            {/* 個別の問題表示 (元のproblemIndexの順序で表示される) */}
            <Paper
              key={`problem-${idx}`}
              p="sm"
              radius="md"
              withBorder
              style={{
                backgroundColor: theme.bgScreen,
              }}
            >
              <Flex gap={30} align="center">
                <Text size={rem(20)} fw={700} ml={10} style={{ color: theme.accent }}>
                  {problem.problemIndex + 1}
                </Text>
                <Group>
                  <Text size={rem(15)} fw={500}>
                    {problem.categoryName}
                  </Text>
                  <Text size={rem(18)} fw={700}>
                    {problem.problemNumber}
                  </Text>
                </Group>
              </Flex>
            </Paper>
          </React.Fragment>
        );
      })}
    </Stack>
  );
};
