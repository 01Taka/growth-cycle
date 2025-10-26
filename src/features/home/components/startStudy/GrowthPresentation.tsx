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

/**
 * プレゼンテーションコンポーネントのProps型定義
 */
interface GrowthPresentationProps {
  currentStep: number; // 現在のステップ (例: 2)
  totalSteps: number; // 全体のステップ数 (例: 3)
  subject: Subject; // PlantImageItemに渡すためのsubject（例: "数学"）
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

// 個々の種の成長ステップを示すコンポーネント (PlantImageItemを使用)
const SeedGrowthStep: React.FC<{ index: number; currentStep: number; subject: Subject }> = ({
  index,
  currentStep,
  subject,
}) => {
  const isCompleted = index < currentStep; // 既に成長済み
  const dirtColor = isCompleted ? 'orange.8' : 'gray.5'; // 土の色

  return (
    <Stack align="center" gap={rem(2)}>
      {/* ユーザー指定のカスタムコンポーネント */}
      <PlantImageItem subject={subject} type="bud" index={index} width={rem(36)} height={rem(36)} />
      {/* 土のビジュアル */}
      <Box
        style={{
          width: rem(36),
          height: rem(8),
          borderRadius: rem(4),
          backgroundColor: dirtColor,
        }}
      />
    </Stack>
  );
};

/**
 * メインのプレゼンテーションコンポーネント
 */
export const GrowthPresentation: React.FC<GrowthPresentationProps> = ({
  currentStep,
  totalSteps,
  subject,
  onStartStudy,
}) => {
  // ステップ表示用の配列を生成 [0, 1, 2, ...]
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <MantineProvider theme={theme}>
      <Card
        shadow="xl"
        padding="xl"
        radius="lg"
        withBorder={false}
        style={{
          backgroundColor: theme.colors?.['custom-blue']?.[6], // 背景の青色
          color: 'white',
          textAlign: 'center',
          maxWidth: rem(350),
          margin: '0 auto',
          boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 10px ${theme.colors?.['custom-blue']?.[6]}`,
        }}
      >
        <Stack gap="lg" align="center">
          {/* タイトルセクション (FaSeedlingを使用) */}
          <Group gap="sm" style={{ padding: rem(10) }}>
            <FaSeedling color="white" size={rem(24)} />
            <Text fw={700} fz="xl" style={{ color: 'white' }}>
              新しい知識を植える
            </Text>
          </Group>

          {/* 説明文 */}
          <Text fz="sm" style={{ color: 'white', opacity: 0.9 }}>
            新しいタネを植えて、成長の物語を始めよう！
          </Text>

          {/* 進捗表示 */}
          <Group justify="center" align="flex-start" gap="xl" mt="md" mb="md">
            {/* ステップ数を左側に表示 */}
            <Text fw={700} fz={rem(36)} style={{ color: 'white' }}>
              {currentStep}/{totalSteps}
            </Text>

            {/* 成長ステップのビジュアル表示 */}
            <Group gap="sm" justify="center">
              {steps.map((stepIndex) => (
                <SeedGrowthStep
                  key={stepIndex}
                  index={stepIndex}
                  currentStep={currentStep}
                  subject={subject}
                />
              ))}
            </Group>
          </Group>

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
            leftSection={<FaRocket size={rem(20)} style={{ paddingRight: rem(4) }} />}
          >
            勉強スタート
          </Button>
        </Stack>
      </Card>
    </MantineProvider>
  );
};
