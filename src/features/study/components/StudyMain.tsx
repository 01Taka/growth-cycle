// src/components/study/StudyMain.tsx (元のファイル名)

import React from 'react';
import { useNavigationBlocker } from '../../../shared/hooks/useConfirmNavigation';
import { StudyLogicContainer } from './main/StudyLogicContainer';
import { useStudyData } from './main/useStudyData';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = () => {
  const studyData = useStudyData();
  useNavigationBlocker({
    shouldNavigationBlock: true,
    allowedUrls: ['/'],
    onBlock: (location) => console.log('ブロックされました', location),
  });

  if (!studyData.isDataReady) {
    return studyData.renderLoadingOrError();
  }

  return <StudyLogicContainer studyData={studyData} />;
};
