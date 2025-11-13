import React from 'react';
import { IconLeaf } from '@tabler/icons-react'; // 葉っぱのアイコンに変更
import { Flex, Pill, Text, useMantineTheme } from '@mantine/core';

interface XpIconPillProps {
  totalGainedXp: number;
}

export const XpIconPill: React.FC<XpIconPillProps> = ({ totalGainedXp }) => {
  const theme = useMantineTheme();

  // Mantineのグリーンの色を使用
  const greenColor = theme.colors.green[6];
  const lightTextColor = 'white'; // 背景が濃い緑なので文字は白に

  return (
    <Flex w={'100%'} justify="flex-end" p="md">
      {/* 右寄せにして余白を追加 */}
      <Pill
        size="lg"
        radius="xl" // 角を丸くすることで、より優しい印象に
        style={{
          backgroundColor: greenColor, // 濃い緑色で大地や葉の色を表現
          color: lightTextColor, // 白文字で視認性アップ
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Flex align="center" gap={4}>
          {/* 葉っぱのアイコンをXPシンボルとして使用 */}
          <IconLeaf size={18} style={{ color: lightTextColor }} />
          <Flex gap={8} align="center">
            <Text size="sm">合計成長XP: </Text>
            <Text size="lg" fw={700}>
              {Math.floor(totalGainedXp)} P
            </Text>
          </Flex>
        </Flex>
      </Pill>
    </Flex>
  );
};
