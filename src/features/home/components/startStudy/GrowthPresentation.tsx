import React from 'react';
import { IconPlant2, IconRocket } from '@tabler/icons-react';
import {
  Box,
  Button,
  Card,
  Center,
  createTheme,
  Group,
  MantineProvider,
  rem,
  Stack,
  Text,
} from '@mantine/core';

// React-Icons を使う場合は以下のようにインポートします（例：FaSeedling）
// import { FaSeedling } from 'react-icons/fa';

/**
 * プレゼンテーションコンポーネントのProps型定義
 */
interface GrowthPresentationProps {
  currentStep: number; // 現在のステップ (例: 2)
  totalSteps: number; // 全体のステップ数 (例: 3)
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

// 個々の種の成長ステップを示すコンポーネント
const SeedGrowthStep: React.FC<{ index: number; currentStep: number }> = ({
  index,
  currentStep,
}) => {
  const isCompleted = index < currentStep; // 既に成長済み
  const isCurrent = index + 1 === currentStep; // 現在のステップ

  // アイコンのスタイル設定
  let iconComponent = null;
  let color = 'gray.4';
  let dirtColor = 'gray.3';

  if (isCompleted || isCurrent) {
    // 成長中の双葉のアイコン。画像に合わせて色を調整
    const plantColor = isCurrent ? '#FFD700' : '#4C6EF5'; // 現在は黄色、完了は青
    iconComponent = (
      <IconPlant2
        style={{
          width: rem(32),
          height: rem(32),
          filter: isCurrent ? 'drop-shadow(0 0 5px #FFD700)' : 'drop-shadow(0 0 5px #4C6EF5)', // キラキラ効果
        }}
        color={plantColor}
        stroke={1.5}
      />
    );
    color = isCurrent ? 'yellow' : 'blue';
    dirtColor = 'orange.8'; // 土の色を濃く
  } else {
    // 未達成のステップは何もなし
    dirtColor = 'gray.5';
    iconComponent = <Box style={{ width: rem(32), height: rem(32) }} />;
  }

  return (
    <Stack align="center" gap={rem(2)}>
      {iconComponent}
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
  onStartStudy,
}) => {
  // ステップ表示用の配列を生成 [0, 1, 2, ...]
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    // MantineProvider でカスタムテーマを適用
    <MantineProvider theme={theme}>
      <Card
        shadow="xl"
        padding="xl"
        radius="lg"
        withBorder={false}
        style={{
          backgroundColor: theme.colors['custom-blue'][6], // 背景の青色
          color: 'white',
          textAlign: 'center',
          maxWidth: rem(350), // 最大幅を設定して中央寄せにする
          margin: '0 auto',
          boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 10px ${theme.colors['custom-blue'][6]}`, // ボックスシャドウを画像に合わせて調整
        }}
      >
        <Stack gap="lg" align="center">
          {/* タイトルセクション */}
          <Group gap="sm" style={{ padding: rem(10) }}>
            <IconPlant2 color="white" style={{ width: rem(24), height: rem(24) }} />
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
                <SeedGrowthStep key={stepIndex} index={stepIndex} currentStep={currentStep} />
              ))}
            </Group>
          </Group>

          {/* ボタン */}
          <Button
            onClick={onStartStudy}
            size="lg"
            radius="xl"
            style={{
              backgroundColor: theme.colors['custom-green'][7], // ボタンの緑色
              color: 'white',
              fontWeight: 700,
              paddingLeft: rem(30),
              paddingRight: rem(30),
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
            leftSection={
              <IconRocket style={{ width: rem(20), height: rem(20) }} fill="white" stroke={0} />
            }
          >
            勉強スタート
          </Button>
        </Stack>
      </Card>
    </MantineProvider>
  );
};

// 使用例 (App.tsx などで利用)
// import { GrowthPresentation } from './GrowthPresentation';
// const App = () => <GrowthPresentation currentStep={2} totalSteps={3} onStartStudy={() => console.log('Start!')} />;
