import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export interface SelfEvaluationConfig {
  type: TestSelfEvaluation;
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const SELF_EVALUATIONS_CONFIGS: Record<TestSelfEvaluation, SelfEvaluationConfig> = {
  confident: {
    type: 'confident',
    text: '自信あり',
    color: '#008919',
    bgColor: '#9BFFA1',
    borderColor: '#02C67B',
  },
  imperfect: {
    type: 'imperfect',
    text: '不安/曖昧',
    color: '#720089',
    bgColor: '#E89BFF',
    borderColor: '#A700D1',
  },
  notSure: {
    type: 'notSure',
    text: '分からない',
    color: '#890000',
    bgColor: '#FFC39B',
    borderColor: '#D12D00',
  },
  unrated: {
    type: 'unrated',
    text: '未選択',
    color: '#4f4f4f',
    bgColor: '#dcdcdc',
    borderColor: '#878787',
  },
} as const;
