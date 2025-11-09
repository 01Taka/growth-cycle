import React from 'react';
import { TextbookFormMain } from '@/features/textbookForm/components/TextbookFormMain';

interface TextbookCreatePageProps {}

export const TextbookCreatePage: React.FC<TextbookCreatePageProps> = ({}) => {
  return (
    <div>
      <TextbookFormMain />
    </div>
  );
};
