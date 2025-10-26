import React from 'react';
// -------------------------------------------------------------
// react-icons/fa からアイコンをインポート
import { FaArrowRight, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { Button, Center, Stack, Text, ThemeIcon } from '@mantine/core';

// -------------------------------------------------------------

interface ReviewCompletionMessageProps {
  // 昨日の復習の完了状態
  isYesterdayCompleted: boolean;
  // 先週の復習の完了状態
  isLastWeekCompleted: boolean;
  // 現在アクティブなタブを切り替えるためのハンドラー
  onTabChange: (tab: 'yesterday' | 'lastWeek') => void;
  // その他の復習に取り組むためのボタンのクリックハンドラー (例として空の関数)
  onStartOtherReview: () => void;
}

const orangeColor = '#f8b449'; // ボタンに使用するオレンジ色

export const ReviewCompletionMessage: React.FC<ReviewCompletionMessageProps> = ({
  isYesterdayCompleted,
  isLastWeekCompleted,
  onTabChange,
  onStartOtherReview,
}) => {
  // 1. 全て完了
  if (isYesterdayCompleted && isLastWeekCompleted) {
    return (
      <Center p="xl" style={{ border: '2px dashed #8c775d', borderRadius: '8px' }}>
        <Stack align="center" gap="md">
          <ThemeIcon size={48} radius="xl" color="green">
            {/* 置き換え: IconCircleCheck -> FaCheckCircle */}
            <FaCheckCircle size={30} />
          </ThemeIcon>
          <Text size="lg" fw={700} c="green">
            素晴らしい！今日の復習タスクはすべて完了しました 🎉
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            このサイクルで復習すべきタスクはもうありません。
          </Text>
          <Button
            variant="filled"
            color={orangeColor}
            radius="md"
            size="md"
            // 置き換え: rightSection={<IconChevronRight size={18} />} -> FaArrowRight
            rightSection={<FaArrowRight size={14} />}
            onClick={onStartOtherReview}
          >
            他の復習に取り組む
          </Button>
        </Stack>
      </Center>
    );
  }

  // 2. 昨日のタスクのみ完了 (先週のタスクが残っている)
  if (isYesterdayCompleted && !isLastWeekCompleted) {
    return (
      <Center p="md">
        <Stack align="center" gap="sm">
          <Text size="md" fw={700} c="green">
            昨日の復習が完了しました！
          </Text>
          <Text size="sm" c="dimmed">
            次は先週の復習に取り組みましょう。
          </Text>
          <Button
            variant="light"
            color={orangeColor}
            radius="md"
            size="sm"
            onClick={() => onTabChange('lastWeek')}
          >
            先週の復習を見る
          </Button>
        </Stack>
      </Center>
    );
  }

  // 3. 先週のタスクのみ完了 (昨日のタスクが残っている)
  if (!isYesterdayCompleted && isLastWeekCompleted) {
    return (
      <Center p="md">
        <Stack align="center" gap="sm">
          <Text size="md" fw={700} c="green">
            先週の復習が完了しました！
          </Text>
          <Text size="sm" c="dimmed">
            次は昨日の復習に取り組みましょう。
          </Text>
          <Button
            variant="light"
            color={orangeColor}
            radius="md"
            size="sm"
            onClick={() => onTabChange('yesterday')}
          >
            昨日の復習を見る
          </Button>
        </Stack>
      </Center>
    );
  }

  // 4. 未完了 (デフォルト: どちらのタスクも残っているか、またはタスクリストが空)
  return (
    <Center p="md">
      <Stack align="center" gap="sm">
        <ThemeIcon size="lg" radius="xl" color="gray">
          {/* 置き換え: IconClock -> FaRegClock */}
          <FaRegClock size={18} />
        </ThemeIcon>
        <Text size="sm" c="dimmed">
          復習アイテムに取り組むのを待っています。
        </Text>
      </Stack>
    </Center>
  );
};
