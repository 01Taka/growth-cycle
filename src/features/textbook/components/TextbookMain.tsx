import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Flex } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { generateDummyTextbookItemProps } from '../functions/generate-dummy';
import { FilterChips } from './filterChip/FilterChips';
import { NewFAB } from './NewFAB';
import { TextbookItemProps } from './shared-props-types';
import { TextbookList } from './TextbookList';

interface TextbookMainProps {}

export const TextbookMain: React.FC<TextbookMainProps> = () => {
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const dummyData = useMemo(() => generateDummyTextbookItemProps(5), []);
  const filterData = useMemo(
    () => dummyData.filter((data) => !selectedSubject || selectedSubject === data.subject),
    [selectedSubject, dummyData]
  );

  const theme = useSubjectColorMap(selectedSubject ?? 'japanese');

  const [displayPlant, setDisplayPlant] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {}, 100);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (selectedSubject !== null) {
      setDisplayPlant(false);
    }

    const timerId = setTimeout(() => {
      setDisplayPlant(true);
    }, 100);

    return () => clearTimeout(timerId);
  }, [selectedSubject]);

  const handleSubjectClick = useCallback((subject: Subject | null) => {
    setSelectedSubject((prev) => {
      if (prev === null && subject === null) {
        return null;
      }
      setDisplayPlant(false);
      return subject === null || prev === subject ? null : subject;
    });
  }, []);

  const onSelectTextbook = (item: TextbookItemProps) => {
    navigate('/start-study');
  };

  const onCreate = () => {
    navigate(`/create-textbook?subject=${selectedSubject ?? 'japanese'}`);
  };

  return (
    <div>
      <Card
        shadow="sm"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1000,
          height: 120,
          backgroundColor: 'white',
          padding: 0,
        }}
      >
        <Flex align="center" justify="center" w="100%" h="100%">
          <FilterChips
            selectedSubjects={selectedSubject ? [selectedSubject] : []}
            onClickSubject={handleSubjectClick}
          />
        </Flex>
      </Card>
      <Box mt={130} mb={130}>
        <TextbookList
          textbookItems={filterData}
          sizeRatio={displayPlant ? 1 : 0}
          onClick={onSelectTextbook}
        />
      </Box>

      <NewFAB onClick={onCreate} style={{ backgroundColor: theme.accent }} />
    </div>
  );
};
