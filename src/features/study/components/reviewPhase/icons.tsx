import { IconCheck, IconCircle, IconCircleDotted, IconTriangle, IconX } from '@tabler/icons-react';
import { IconType } from 'react-icons';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ProblemScoringStatus } from '../../types/problem-types';

/**
 * 💡 Scoring Status に対応するアイコンと色のマップ
 */
export const ScoringStatusIconMap: Record<ProblemScoringStatus, { icon: IconType; color: string }> =
  {
    correct: { icon: IconCircle, color: 'green' }, // 正解: チェックマーク（緑）
    incorrect: { icon: IconX, color: 'red' }, // 不正解: バツ印（赤）
    unrated: { icon: IconCircleDotted, color: 'gray' }, // 未採点: 点線丸（灰色）
  };

/**
 * 💡 Self Evaluation に対応するアイコンと色のマップ
 */
export const SelfEvaluationIconMap: Record<TestSelfEvaluation, { icon: IconType; color: string }> =
  {
    unrated: { icon: IconCircleDotted, color: 'gray' }, // 未評価: 四角（灰色）
    notSure: { icon: IconX, color: 'orange' }, // 自信なし: 悲しい顔（赤）
    imperfect: { icon: IconTriangle, color: 'purple' }, // 不完全: 普通の顔（黄）
    confident: { icon: IconCheck, color: 'green' }, // 自信あり: 笑顔（緑）
  };

/**
 * ScoringStatusに対応するアイコンコンポーネントと色を取得する関数
 * @param status ProblemScoringStatus
 * @returns アイコンコンポーネントと色
 */
export const getScoringStatusIcon = (status: ProblemScoringStatus) => {
  return ScoringStatusIconMap[status];
};

/**
 * TestSelfEvaluationに対応するアイコンコンポーネントと色を取得する関数
 * @param evaluation TestSelfEvaluation
 * @returns アイコンコンポーネントと色
 */
export const getSelfEvaluationIcon = (evaluation: TestSelfEvaluation) => {
  return SelfEvaluationIconMap[evaluation];
};
