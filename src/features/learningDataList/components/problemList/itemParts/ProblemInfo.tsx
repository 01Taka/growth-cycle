import React from 'react';
import { Badge, Flex, rem, Stack, Text } from '@mantine/core';
import { ProblemListItemData } from '@/features/learningDataList/types/problem-list-types';
import { DEFAULT_LABELS } from '@/shared/constants/document-constants';

interface ProblemInfoProps {
  problem: ProblemListItemData;
}

export const ProblemInfo: React.FC<ProblemInfoProps> = ({ problem }) => {
  const { textbookName, unitName, categoryName, problemNumber } = problem;

  return (
    <Stack gap={5} style={{ flexGrow: 1, minWidth: rem(120) }}>
      {/* 1行目: ユニット名 (最重要) */}
      <Text size="md" fw={700} lineClamp={1}>
        {unitName ?? textbookName}
      </Text>

      {/* 2行目: テキスト名 (コンテキスト) */}
      <Badge variant="filled" size="sm" color="gray" w="fit-content">
        {textbookName}
      </Badge>

      {/* 3行目: カテゴリーと問題番号 (詳細位置) */}
      <Flex gap="md" align="center">
        <Text size="sm" c="dimmed">
          {categoryName ?? DEFAULT_LABELS.category}
        </Text>
        <Text size="sm" fw={700} c="dark">
          {problemNumber}
        </Text>
      </Flex>
    </Stack>
  );
};
