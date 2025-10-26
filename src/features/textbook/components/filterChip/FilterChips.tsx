import React from 'react';
import { Flex } from '@mantine/core';
import { Subject } from '@/shared/types/study-shared-types';
import { FilterChip } from './FilterChip';

interface FilterChipsProps {
  selectedSubjects: Subject[];
  onClickSubject: (subject: Subject) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ selectedSubjects, onClickSubject }) => {
  const subjects: Subject[] = ['japanese', 'math', 'english', 'science', 'socialStudies'];
  const SubjectLabels: Record<Subject, string> = {
    japanese: '国語',
    math: '数学',
    english: '英語',
    science: '理科',
    socialStudies: '社会',
  };

  return (
    <Flex gap={1} style={{ padding: 10, overflow: 'auto' }}>
      {subjects.map((subject) => (
        <FilterChip
          key={subject}
          subject={subject}
          label={SubjectLabels[subject]}
          checked={selectedSubjects.includes(subject)}
          size={'lg'}
          onClick={() => onClickSubject(subject)}
        />
      ))}
    </Flex>
  );
};
