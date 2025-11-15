// src/components/ReviewSection.tsx (仮のパス)

import React from 'react';
import {
  IconChevronDown,
  IconChevronUp,
  IconClockHour3,
  IconSquareCheck,
} from '@tabler/icons-react';
// Chevronアイコンをインポート
import { rem, Stack, Text } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ReviewItemList } from './eviewItemList';

interface ReviewSectionProps {
  title: 'reviewPlanned' | 'reviewCompleted';
  cycles: LearningCycleDocument[];
  tabKey: string;
  isCompleted: boolean;
  displayDetailCycleId: string | null;
  onToggleDetail: (cycleId: string) => void;
  onSelectReviewTarget: (cycle: LearningCycleDocument | null) => void;
  // 以下、新たに追加するProps
  isSectionOpen?: boolean; // セクションの展開状態 (オプション: reviewPlannedでは使用しないため)
  onToggleSection?: () => void; // セクションのトグル関数 (オプション: reviewPlannedでは使用しないため)
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  cycles,
  tabKey,
  isCompleted,
  displayDetailCycleId,
  onToggleDetail,
  onSelectReviewTarget,
  isSectionOpen = true,
  onToggleSection,
}) => {
  const isPlanned = title === 'reviewPlanned';
  const color = isPlanned ? COLORS.orangeButton : COLORS.completedGreen;
  const Icon = isPlanned ? IconClockHour3 : IconSquareCheck;
  const titleText = isPlanned
    ? REVIEW_LABELS.reviewPlannedTitle
    : REVIEW_LABELS.reviewCompletedTitle;

  // 完了済みのセクションであり、かつトグル関数が渡されている場合
  const isToggleable = !isPlanned && onToggleSection;
  const ChevronIcon = isSectionOpen ? IconChevronUp : IconChevronDown;

  return (
    <Stack gap="xs">
      <Text
        size="lg"
        fw={700}
        c={color}
        // クリック可能にするためのスタイルとイベントハンドラ
        style={{
          borderLeft: `4px solid ${color}`,
          paddingLeft: rem(8),
          cursor: isToggleable ? 'pointer' : 'default', // トグル可能な場合のみカーソルをpointerに
        }}
        onClick={isToggleable ? onToggleSection : undefined} // トグル可能な場合のみクリックハンドラを設定
      >
        <Icon style={{ verticalAlign: 'middle', marginRight: rem(4) }} />
        {titleText} ({cycles.length}){/* トグル可能な場合にのみ矢印アイコンを表示 */}
        {isToggleable && (
          <ChevronIcon
            size={18}
            style={{
              verticalAlign: 'middle',
              marginLeft: rem(8),
              transition: 'transform 0.2s', // アニメーション
            }}
          />
        )}
      </Text>

      {(isPlanned || isSectionOpen) && (
        <Stack gap="xs">
          <ReviewItemList
            cycles={cycles}
            tabKey={tabKey}
            isCompleted={isCompleted}
            displayDetailCycleId={displayDetailCycleId}
            onToggleDetail={onToggleDetail}
            onSelectReviewTarget={onSelectReviewTarget}
          />
        </Stack>
      )}
    </Stack>
  );
};
