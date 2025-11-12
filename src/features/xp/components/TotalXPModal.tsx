import React, { useEffect, useState } from 'react';
import { IconCheck, IconClockHour4, IconLeaf, IconStar, IconTrophy } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Progress,
  rem,
  Stack,
  Text,
  Transition,
  useMantineTheme,
} from '@mantine/core';

// --- 型定義 (TotalXPModalで使用される最新のインターフェース) ---

export interface XPResults {
  correctRate: number;

  qualityScore: number;
  qualityEffortDurationScore: number;

  correctnessXpBase: number;
  correctnessBonusScore: number;
  correctnessBonusType: string;
  correctnessSpeedMultiplier: number;

  xpLearningTime: number; // 修正: xpTime の代わりに利用
  xpPlantGrowth: number;
  xpQuality: number; // 修正: xpQualityを学習効率・自己評価の質として利用
  xpCorrectness: number;

  floatTotalXP: number;
  totalXP: number;
}

// --- コンポーネント定数 ---
const TRANSITION_DURATION = 500;
const ITEM_DELAY = 150;

// XP増加のアニメーションを担うカスタムコンポーネント
const AnimatedXP = ({ targetXP }: { targetXP: number }) => {
  const [currentXP, setCurrentXP] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const step = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      // イージングとしてキュービックイーズアウトを使用
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextXP = Math.floor(easedProgress * targetXP);

      setCurrentXP(nextXP);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrentXP(targetXP);
      }
    };
    requestAnimationFrame(step);
  }, [targetXP]);

  return (
    <Text component="span" fz={rem(80)} fw={700} c="teal.6" style={{ lineHeight: 1 }}>
      {currentXP.toLocaleString()}
    </Text>
  );
};

interface TotalXPModalProps {
  opened: boolean;
  onClose: () => void;
  results: XPResults;
}

export function TotalXPModal({ opened, onClose, results }: TotalXPModalProps) {
  const theme = useMantineTheme();
  const { totalXP, floatTotalXP, xpPlantGrowth } = results;

  // 1. XP要素のリストを最新のXPResults構造に合わせて再定義
  const rawXpFactors = [
    {
      label: 'XP_学習時間 (投入時間)',
      value: results.xpLearningTime, // 修正: xpTime -> xpLearningTime
      icon: <IconClockHour4 size={20} />,
      color: 'blue',
    },
    {
      label: 'XP_正答率 (成果)',
      value: results.xpCorrectness,
      icon: <IconCheck size={20} />,
      color: 'green',
    },
    {
      label: 'XP_質 (学習効率×テスト時間)',
      value: results.xpQuality,
      icon: <IconStar size={20} />,
      color: 'grape',
      breakdown: `質スコア: ${(results.qualityScore * 100).toFixed(0)}% × 所要時間スコア: ${(results.qualityEffortDurationScore * 100).toFixed(0)}%`,
    },
    {
      label: 'XP_植物成長',
      value: xpPlantGrowth,
      icon: <IconLeaf size={20} />,
      color: 'lime',
    },
  ];

  // 2. ソートとフィルタリングを実行
  const xpFactors = rawXpFactors
    .filter((factor) => factor.value > 0) // XPが0の要素を非表示
    .sort((a, b) => b.value - a.value); // 量が多い順にソート

  // 3. 最大貢献度を計算
  const maxContribution = Math.max(...rawXpFactors.map((f) => f.value));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconTrophy size={28} style={{ color: theme.colors.orange[6] }} />
          <Text fz="xl" fw={600}>
            XP獲得結果と植物成長
          </Text>
        </Group>
      }
      size="md"
      transitionProps={{ duration: TRANSITION_DURATION, transition: 'pop' }}
      centered
      closeOnClickOutside={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        style: { backdropFilter: 'blur(3px)' },
      }}
    >
      <Stack align="center" gap="xl">
        {/* --- 1. 植物アニメーションスペース --- */}
        <Box
          w="100%"
          h={rem(150)}
          bg="green.0"
          style={{
            borderRadius: theme.radius.md,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            border: `1px solid ${theme.colors.green[3]}`,
            position: 'relative',
          }}
        >
          {/* 植物成長の表現（ここでは簡易的に） */}
          <Text c="green.9" fz="lg" fw={700}>
            🌱 植物が {xpPlantGrowth.toFixed(2)} だけ成長しました
          </Text>
        </Box>
        <Divider style={{ width: '100%' }} />

        {/* --- 2. 最終XPの表示 --- */}
        <Stack align="center" gap={4}>
          <Text fz="lg" c="dimmed">
            獲得した合計XP
          </Text>
          <AnimatedXP targetXP={totalXP} />
          <Badge c="gray" variant="light" size="lg">
            (内部計算値: {floatTotalXP.toFixed(2)})
          </Badge>
        </Stack>

        <Divider style={{ width: '100%' }} />

        {/* --- 3. 各XP要素の貢献度 (ソートされ、0の要素は非表示) --- */}
        <Text fz="md" fw={500} style={{ alignSelf: 'flex-start' }}>
          ✨ 各要素の貢献度 (合計: {floatTotalXP.toFixed(2)})
        </Text>
        <Stack style={{ width: '100%' }} gap="sm">
          {xpFactors.map((factor, index) => (
            <Transition
              key={factor.label}
              mounted={opened}
              transition="slide-right"
              duration={TRANSITION_DURATION}
              timingFunction="ease"
              // アニメーションの開始を遅延させる
              enterDelay={TRANSITION_DURATION + index * ITEM_DELAY}
            >
              {(styles) => (
                <div style={styles}>
                  <Group justify="space-between" mb={4} gap={0}>
                    <Group gap="xs">
                      {React.cloneElement(factor.icon, { c: theme.colors[factor.color][6] })}
                      <Text fz="sm" fw={500}>
                        {factor.label}
                      </Text>
                    </Group>
                    <Text fz="sm" fw={600} c={factor.color}>
                      +{factor.value.toFixed(2)} XP
                    </Text>
                  </Group>
                  <Progress
                    // maxContributionは全ての要素の最大値を使用するため、0の要素が非表示でも比率は正しい
                    value={(factor.value / maxContribution) * 100}
                    size="sm"
                    color={factor.color}
                    radius="xl"
                  />
                </div>
              )}
            </Transition>
          ))}
        </Stack>
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button onClick={onClose} variant="filled" color="teal">
          閉じる
        </Button>
      </Group>
    </Modal>
  );
}
