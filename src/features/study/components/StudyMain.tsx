import React from 'react';
import { StudyPhase } from './study/StudyPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  return (
    <div>
      <StudyPhase />
    </div>
  );
};
