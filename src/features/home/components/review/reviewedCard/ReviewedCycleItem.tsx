import React from 'react';
import { Box, Card, rem, Stack, Text, Tooltip } from '@mantine/core'; // Tooltipを追加して、省略されたテキスト名を表示できるようにする
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

// 未使用のインポートを削除: import { PlantSection } from '@/features/learningHistory/components/item/PlantSection';

/**
 * 学習サイクルレビューアイテムのプロパティ
 */
export interface ReviewedCycleItemProps {
  plant: Plant;
  subject: Subject;
  textbookName: string;
  correctRate: number;
}

/**
 * 学習サイクルレビューのアイテムコンポーネント
 * @param props ReviewedCycleItemProps
 */
export const ReviewedCycleItem: React.FC<ReviewedCycleItemProps> = ({
  plant,
  subject,
  textbookName,
  correctRate,
}) => {
  // カスタムフックを使用して、テーマカラーマップを取得
  const theme = useSubjectColorMap(subject ?? 'unselected');
  const correctRatePercentage = Math.floor(correctRate * 100);

  // テキスト名が長い場合に省略されるため、Tooltipでホバー時に全体を表示できるように改善
  const truncatedTextbookName = (
    <Tooltip label={textbookName} withArrow position="bottom">
      <Text
        size="md"
        fw={700}
        c={theme.text}
        w={rem(100)} // 幅を固定
        truncate="end" // テキストがオーバーフローした場合に省略記号 (...) を表示
      >
        {textbookName}
      </Text>
    </Tooltip>
  );

  return (
    // Cardのpaddingを調整し、スタイルをMantineのpropsで設定
    <Card
      w={'100%'}
      h={'100%'}
      bg={theme.bgCard}
      radius="lg" // borderRadius: 16 -> radius="lg" or radius={16}
      p={0}
      style={{
        display: 'flex', // Flexboxを使用して子要素を中央揃えしやすくする
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack align="center" justify="center" gap={0} h={'100%'} py="xs">
        {/* 上部の植物と正答率のセクション */}
        <Stack gap={0} align="center" justify="center">
          {/* 正答率のテキストを絶対位置から相対位置に変更し、PlantWithEffectの上に重ねる */}
          <Box
            style={{
              position: 'relative',
              height: rem(70),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xl" fw={700} style={{ zIndex: 100, position: 'absolute' }}>
              {correctRatePercentage}%
            </Text>

            {/* PlantWithEffectのコンテナ。正答率と被らないように調整 */}
            <Box mt={rem(10)}>
              <PlantWithEffect
                plant={plant}
                subject={subject}
                auraEffect={{
                  blurRadius: 18,
                  opacity: 0.5,
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* 下部のテキスト名セクション */}
        <Box mt="xs" style={{ minHeight: rem(24) }}>
          {' '}
          {/* テキストが表示される最低限の高さを確保 */}
          {truncatedTextbookName}
        </Box>
      </Stack>
    </Card>
  );
};
