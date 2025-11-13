import React from 'react';
import { Flex, Grid } from '@mantine/core';
import { SUBJECT_LABEL_MAP } from '@/shared/constants/document-constants';
import { Subject } from '@/shared/types/subject-types';
import { FilterChip } from './FilterChip';

interface FilterChipsProps {
  selectedSubjects: Subject[];
  onClickSubject: (subject: Subject | null) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ selectedSubjects, onClickSubject }) => {
  const subjects: (Subject | 'unselected')[] = [
    'japanese',
    'math',
    'english',
    'science',
    'socialStudies',
    'unselected',
  ];

  return (
    <Grid
      gutter="xs"
      // ここに justify="center" を追加
      justify="center"
      style={{ padding: 10, overflow: 'auto' }}
    >
      {subjects.map((subject) => (
        <Grid.Col span="content" key={subject}>
          <FilterChip
            subject={subject}
            label={SUBJECT_LABEL_MAP[subject]}
            checked={
              (subject === 'unselected' && selectedSubjects.length === 0) ||
              selectedSubjects.includes(subject as Subject)
            }
            size={'lg'}
            onClick={() => onClickSubject(subject !== 'unselected' ? subject : null)}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};
