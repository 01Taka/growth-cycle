import React, { useMemo } from 'react';
import { ComboboxData, Flex, Select, Title } from '@mantine/core';
import { SUBJECT_LABEL_MAP } from '@/shared/constants/document-constants';
import { Subject } from '@/shared/types/subject-types';
import { HISTORY_SORT_OPTIONS } from '../constants/sort-options';
import { HistorySortType } from '../types/learning-history-types';

// Propsの型定義
interface LearningHistoryHeaderProps {
  learningCycleSubjects: Subject[]; // 全ての学習サイクルの教科名配列
  subjectFilter: string | null;
  setSubjectFilter: (value: string | null) => void;
  sortBy: HistorySortType;
  setSortBy: (value: HistorySortType) => void;
}

export const LearningHistoryHeader: React.FC<LearningHistoryHeaderProps> = ({
  learningCycleSubjects,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
}) => {
  // 教科フィルターオプションの生成
  const subjectOptions: ComboboxData = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(learningCycleSubjects));
    const options = uniqueSubjects.map((subject) => ({
      value: subject,
      label: SUBJECT_LABEL_MAP[subject],
    }));
    return [{ value: '', label: 'すべて' }, ...options];
  }, [learningCycleSubjects]);

  return (
    <>
      <Title order={2} fw={700} style={{ width: '95%', textAlign: 'left' }}>
        学習履歴
      </Title>
      <Flex
        gap="md"
        w="95%" // 幅をここに移動
        justify="flex-end" // 必要に応じて調整
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 10,
        }}
      >
        <Select
          label="教科フィルター"
          data={subjectOptions}
          value={subjectFilter}
          onChange={setSubjectFilter}
          placeholder="すべての教科"
          allowDeselect={true}
          w={150}
        />
        <Select
          label="並べ替え"
          data={HISTORY_SORT_OPTIONS}
          value={sortBy}
          onChange={(value) => setSortBy((value as HistorySortType | null) || 'fixation')}
          placeholder="並べ替え基準"
          allowDeselect={false}
          w={180}
        />
      </Flex>
    </>
  );
};
