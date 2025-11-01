import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Subject } from '@/shared/types/subject-types';
import { generateDummyTextbookItemProps } from '../functions/generate-dummy';
import { FilterChips } from './filterChip/FilterChips';
import { TextbookList } from './TextbookList';

interface TextbookMainProps {}

export const TextbookMain: React.FC<TextbookMainProps> = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const dummyData = useMemo(() => generateDummyTextbookItemProps(3), []);
  const filterData = useMemo(
    () => dummyData.filter((data) => !selectedSubject || selectedSubject === data.subject),
    [selectedSubject, dummyData]
  );

  const [displayPlant, setDisplayPlant] = useState(false); // 初期値をtrueに設定

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDisplayPlant(true);
    }, 100);

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

  const handleSubjectClick = useCallback((subject: Subject) => {
    setDisplayPlant(false);

    setTimeout(() => {
      setSelectedSubject((prev) => (prev === subject ? null : subject));
    }, 30);
  }, []);

  return (
    <div>
      <FilterChips
        selectedSubjects={selectedSubject ? [selectedSubject] : []}
        onClickSubject={handleSubjectClick}
      />
      <TextbookList textbookItems={filterData} displayPlant={displayPlant} />
    </div>
  );
};
