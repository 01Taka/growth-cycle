import React, { useState } from 'react';
import { IconBook, IconSearch } from '@tabler/icons-react';
import { ActionIcon, Box, Flex, Paper, Stack, Text } from '@mantine/core';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { ProblemFilters } from './ProblemFilters';
import { ProblemListContent } from './ProblemListContent';
import { useProblemFiltering } from './useProblemFiltering';

interface LearningProblemKeyListProps {
  problems: ExpandedLearningCycleProblem[];
  theme: SubjectColorMap;
  headerTop?: number;
}

export const LearningProblemKeyList: React.FC<LearningProblemKeyListProps> = ({
  problems,
  theme,
  headerTop = 60,
}) => {
  // 1. フィルター表示状態を管理するstateを追加
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // カスタムフックからロジックと状態を取得
  const {
    searchQuery,
    setSearchQuery,
    unitFilter,
    setUnitFilter,
    categoryFilter,
    setCategoryFilter,
    uniqueUnits,
    uniqueCategories,
    filteredProblems,
  } = useProblemFiltering({ problems });

  // 検索アイコンのクリックハンドラ
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // 検索アイコンの色を動的に設定

  return (
    <Box style={{ maxWidth: '100%', color: theme.text, position: 'relative' }}>
      <Stack gap="md">
        {/* ヘッダー */}
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{ position: 'sticky', top: headerTop, zIndex: 1000 }}
        >
          <Flex justify="space-between" align="center">
            {/* タイトルとアイコンをまとめる */}
            <Flex align="center" gap="xs">
              <IconBook size={24} />
              <Text size="xl" fw={700}>
                テスト問題一覧
              </Text>
            </Flex>
            {/* 2. 検索アイコンとトグル機能の追加 */}
            <Flex
              gap={0}
              align="center"
              justify="center"
              style={{
                backgroundColor: isFilterOpen ? theme.bgChip : undefined,
                borderRadius: 16,
                padding: '0 10px',
                height: 30,
              }}
            >
              {isFilterOpen && <Text>{filteredProblems.length}件</Text>}
              <ActionIcon
                variant="subtle"
                onClick={toggleFilter}
                size="lg"
                aria-label={isFilterOpen ? 'フィルターを非表示' : 'フィルターを表示'}
              >
                <IconSearch size={22} />
              </ActionIcon>
            </Flex>
          </Flex>
          {/* 3. isFilterOpenに応じてフィルターコンポーネントを表示/非表示 */}
          {isFilterOpen && (
            <Box mt="sm">
              <ProblemFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                unitFilter={unitFilter}
                setUnitFilter={setUnitFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                uniqueUnits={uniqueUnits}
                uniqueCategories={uniqueCategories}
              />
            </Box>
          )}
        </Paper>
        {/* 問題リストコンポーネント */}
        <Box mb={100}>
          <ProblemListContent filteredProblems={filteredProblems} theme={theme} />   
        </Box>
      </Stack>
    </Box>
  );
};
