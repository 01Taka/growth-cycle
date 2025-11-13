import React from 'react';
import { Flex, Pill, rem, Stack, Text } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';

interface StudyHeaderProps {
  subject: Subject;
  textbookName: string;
  units: string[];
  defaultTextNameLabel?: string;
}

// 💡 表示するPillの最大数を定義します（この数を超えると省略表示が適用されます）
const MAX_UNITS_VISIBLE = 5;

export const StudyHeader: React.FC<StudyHeaderProps> = ({
  subject,
  textbookName,
  units,
  defaultTextNameLabel,
}) => {
  const theme = useSubjectColorMap(subject ?? 'unselected');

  // 表示するユニットを制限
  const visibleUnits = units.slice(0, MAX_UNITS_VISIBLE);

  // 省略するユニットの数を計算
  const remainingUnitsCount = units.length - visibleUnits.length;

  // 省略表示用のPillのラベル
  const ellipsisPillLabel = `+${remainingUnitsCount}`;

  return (
    <Stack align="center">
      <Text size={rem(20)} style={{ color: theme.accent }} fw={500}>
        {subject?.toLocaleUpperCase()}
      </Text>
      <Text
        size={rem(25)}
        fw={700}
        style={{ color: textbookName ? theme.text : toRGBA(theme.text, 0.5) }}
      >
        {textbookName || defaultTextNameLabel}
      </Text>

      {/* 1. Flexに行替えを設定 (`wrap="wrap"`) */}
      <Flex gap={8} wrap="wrap" justify="center" maw="500px">
        {/* max-width (maw) で一定幅をシミュレート */}
        {/* 2. 表示するPillのレンダリング */}
        {visibleUnits.map((unit, index) => (
          <Pill
            key={index}
            size="lg"
            styles={{ label: { color: theme.text }, root: { background: theme.bgChip } }}
          >
            {unit}
          </Pill>
        ))}
        {/* 3. 省略表示 (+X) のレンダリング */}
        {remainingUnitsCount > 0 && (
          <Pill
            size="lg"
            styles={{
              label: { color: theme.text, fontWeight: 700 }, // 強調
              root: { background: theme.bgChip, opacity: 0.8 }, // わずかにスタイルを変更しても良い
            }}
          >
            {ellipsisPillLabel}
          </Pill>
        )}
      </Flex>
    </Stack>
  );
};
