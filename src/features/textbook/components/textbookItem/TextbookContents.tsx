import React from 'react';
import { Card, Group, rem, Stack, Text, Title } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';

interface TextbookContentsProps {
  subject: Subject;
  textbookName: string;
  totalPlants: number;
  daysSinceLastAttempt: number;
}

export const TextbookContents: React.FC<TextbookContentsProps> = ({
  subject,
  textbookName,
  totalPlants,
  daysSinceLastAttempt,
}) => {
  const theme: SubjectColorMap = useSubjectColorMap(subject);

  // 最後の取り組み日数を日本語文字列に変換
  const daysText = daysSinceLastAttempt === 0 ? '本日' : `${daysSinceLastAttempt}日前`;

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      // 💡 Cardの背景色にbgCardを適用 (画像での薄い緑色)
      style={{ backgroundColor: theme.bgCard, border: `2px solid ${theme.border}` }}
      // 画像には枠線がないため withBorder は削除
    >
      {/* メインレイアウト: 左右に分割 */}
      <Group gap={0} justify="space-between" align="center" wrap="nowrap">
        {/* === 左側: 教材情報 (科目名と教材名) === */}
        <Stack gap={rem(4)} style={{ flexGrow: 1, padding: 5, paddingRight: 0, minWidth: 0 }}>
          {/* 科目名 */}
          <Text
            size="lg"
            fw={700}
            // 💡 科目名の色にaccentを適用 (画像での鮮やかな緑)
            style={{ color: theme.accent, lineHeight: 1 }}
          >
            {subject}
          </Text>

          {/* 教材名 */}
          <Title
            order={2}
            size={rem(28)} // 画像の見た目に合わせて調整
            fw={900}
            style={{ color: theme.text, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'auto' }}
          >
            {textbookName}
          </Title>
        </Stack>

        {/* === 右側: ステータス情報 (日付と植物数) === */}
        <Stack gap={rem(12)} align="flex-end" style={{ flexShrink: 0 }}>
          {/* 最終取り組み日 */}
          <Text size="sm" style={{ color: theme.text, lineHeight: 1 }}>
            最終取組日: {daysText}
          </Text>

          {/* 植物数 */}
          <Text size="lg" fw={700} style={{ color: theme.text, lineHeight: 1 }}>
            植物数 : {totalPlants}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
