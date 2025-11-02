import React from 'react';
import { StudyTimer } from './StudyTimer';

interface StudyPhaseProps {}

export const StudyPhase: React.FC<StudyPhaseProps> = ({}) => {
  return (
    <div>
      <StudyTimer isFilling={false} />
    </div>
  );
};
