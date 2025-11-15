// HomeReviewCard.tsx
import React, { useMemo, useState } from 'react';
import { Card } from '@mantine/core';
import { expandLearningCycle } from '@/features/app/learningCycles/functions/expand-learning-cycle-utils';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ReviewedCycleCard } from '../reviewedCard/ReviewedCycleCard';
import { StartReviewModal } from '../StartReviewModal';
import { HomeReviewCardHeader } from './HomeReviewCardHeader';
import { HomeReviewTabs } from './tab/HomeReviewTabs';

interface HomeReviewCardProps {
  displayGroupKeys: string[];
  groupedTodayReviewCycles: Record<string, LearningCycleDocument[]>;
  groupedTodayReviewedCycles: Record<string, LearningCycleDocument[]>;
  todayReviewCyclesCount: number;
  todayReviewedCyclesCount: number;
  onStartReview: (reviewCycle: LearningCycleDocument | null) => void;
}

export const HomeReviewCard: React.FC<HomeReviewCardProps> = ({
  displayGroupKeys,
  groupedTodayReviewCycles,
  groupedTodayReviewedCycles,
  todayReviewCyclesCount,
  todayReviewedCyclesCount,
  onStartReview,
}) => {
  const [reviewTarget, setReviewTarget] = useState<null | LearningCycleDocument>(null);

  const reviewTargetProblems = useMemo(() => {
    if (reviewTarget) {
      return expandLearningCycle(reviewTarget)?.problems ?? [];
    }
    return [];
  }, [reviewTarget]);

  const remainingTasks = todayReviewCyclesCount;
  const totalTasks = todayReviewCyclesCount + todayReviewedCyclesCount;
  const progressString = REVIEW_LABELS.getProgressPillLabel(todayReviewedCyclesCount, totalTasks);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="lg"
      bg={COLORS.cardBg}
      style={{ margin: '10px', border: `3px solid ${COLORS.cardBorder}` }}
    >
      {/* --- ヘッダーと進捗表示 --- */}
      <HomeReviewCardHeader remainingTasks={remainingTasks} progressString={progressString} />

      <HomeReviewTabs
        displayGroupKeys={displayGroupKeys}
        groupedTodayReviewCycles={groupedTodayReviewCycles}
        groupedTodayReviewedCycles={groupedTodayReviewedCycles}
        onSelectReviewTarget={setReviewTarget} // reviewTargetを設定する関数を渡す
      />
      {/* --- タブとコンテンツ --- */}

      {/* --- モーダル --- */}
      <StartReviewModal
        subject={reviewTarget?.subject ?? 'japanese'}
        textbookName={reviewTarget?.textbookName ?? ''}
        units={(reviewTarget?.units ?? []).map((unit) => unit.name)}
        problems={reviewTargetProblems}
        opened={reviewTarget !== null}
        onClose={() => setReviewTarget(null)}
        onStartReview={() => onStartReview(reviewTarget)}
      />
    </Card>
  );
};
