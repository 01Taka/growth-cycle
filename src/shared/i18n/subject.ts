import { Language } from '../types/language-types';
import { Subject } from '../types/subject-types';

export const subjectResources: Record<Language, Record<'subjects', Record<Subject, string>>> = {
  en: {
    subjects: {
      japanese: 'japanese',
      math: 'math',
      english: 'english',
      science: 'science',
      socialStudies: 'socialStudies',
    },
  },
  ja: {
    subjects: {
      japanese: '国語',
      math: '数学',
      english: '英語',
      science: '理科',
      socialStudies: '社会',
    },
  },
};
