import React from 'react';
import { FaRocket, FaSeedling } from 'react-icons/fa'; // React Iconsから必要なアイコンをインポート
import {
  Box,
  Button,
  Card,
  createTheme,
  Group,
  MantineProvider,
  rem,
  Stack,
  Text,
} from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { Subject } from '@/shared/types/study-shared-types';
import { StudyCountView } from './StudyCountView';

/**
 * プレゼンテーションコンポーネントのProps型定義
 */
interface GrowthPresentationProps {
  learnings: { subject: Subject }[];
  onStartStudy: () => void; // 「勉強スタート」ボタンクリック時のハンドラ
}

// 画像の青い背景と緑のボタンに合わせたカスタムテーマ
const theme = createTheme({
  colors: {
    'custom-blue': [
      '#eef3ff',
      '#dce4f6',
      '#b8c8eb',
      '#91a9df',
      '#6d8fd4',
      '#557fd0',
      '#4977d0', // メインの背景色に近い色
      '#3a64b9',
      '#3058a6',
      '#234a94',
    ],
    'custom-green': [
      '#e6fcf4',
      '#c2f7e0',
      '#99edcb',
      '#70e2b4',
      '#4cd89e',
      '#3ac58c',
      '#31b282', // ボタンのメインカラーに近い色
      '#218c64',
      '#106648',
      '#003d2b',
    ],
  },
  primaryColor: 'custom-blue',
  primaryShade: 6,
});

/**
 * メインのプレゼンテーションコンポーネント
 */
export const GrowthPresentation: React.FC<GrowthPresentationProps> = ({
  learnings,
  onStartStudy,
}) => {
  return (
    <Card
      shadow="xl"
      padding="md"
      radius="lg"
      withBorder={false}
      style={{
        backgroundColor: theme.colors?.['custom-blue']?.[3], // 背景の青色
        border: `3px solid ${theme.colors?.['custom-blue']?.[6]}`,
        color: 'white',
        textAlign: 'center',
        margin: '10px',
        boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 10px ${theme.colors?.['custom-blue']?.[6]}`,
      }}
    >
      <Stack gap="sm" align="center">
        {/* タイトルセクション (FaSeedlingを使用) */}
        <Group gap="sm" style={{ padding: rem(10) }}>
          <FaSeedling color="black" />
          <Text fw={500} fz="h2" style={{ color: 'black' }}>
            新しい知識を植える
          </Text>
        </Group>

        {/* 説明文 */}
        <Text fz="sm" style={{ color: 'black', opacity: 0.9 }}>
          新しいタネを植えて、成長の物語を始めよう！
        </Text>

        {/* 進捗表示 */}
        <StudyCountView learnings={learnings} maxLearningNum={3} />

        {/* ボタン (FaRocketを使用) */}
        <Button
          onClick={onStartStudy}
          size="lg"
          radius="xl"
          style={{
            backgroundColor: theme.colors?.['custom-green']?.[7], // ボタンの緑色
            color: 'white',
            fontWeight: 700,
            paddingLeft: rem(30),
            paddingRight: rem(30),
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          leftSection={<FaRocket />}
        >
          勉強スタート
        </Button>
      </Stack>
    </Card>
  );
};
