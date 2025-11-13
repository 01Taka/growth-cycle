import React, { useEffect, useState } from 'react';
import { IconCheck, IconClockHour4, IconLeaf, IconStar, IconTrophy } from '@tabler/icons-react';
import {
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Progress,
  rem,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { DirtMound } from '@/features/study/components/shared/DirtMound';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { XPResults } from '../types/xp-types';

// --- 型定義 (TotalXPModalで使用される最新のインターフェース) ---

// --- コンポーネント定数 ---
const TRANSITION_DURATION = 500;
const ITEM_DELAY = 150;

// XP増加のアニメーションを担うカスタムコンポーネント
const AnimatedXP = ({ targetXP, theme }: { targetXP: number; theme: SubjectColorMap }) => {
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
    <Text component="span" fz={rem(80)} fw={700} c={theme.accent} style={{ lineHeight: 1 }}>
      {currentXP.toLocaleString()}
    </Text>
  );
};

interface TotalXPModalProps {
  opened: boolean;
  onClose: () => void;
  learningCycle: LearningCycleDocument;
  results: XPResults;
}

export function TotalXPModal({ opened, onClose, results, learningCycle }: TotalXPModalProps) {
  const theme = useSubjectColorMap(learningCycle.subject);
  const { totalXP, floatTotalXP, xpPlantGrowth } = results;

  const correctnessLabel = `正答率XP ${results.correctnessBonusType === 'none' ? '' : `(${results.correctnessBonusType === 'growth' ? '成長+' : '高得点+'}${results.correctnessBonusScore}, 速度×${results.correctnessSpeedMultiplier})`}`;

  // 1. XP要素のリストを最新のXPResults構造に合わせて再定義
  const rawXpFactors = [
    {
      label: '学習時間XP',
      value: results.xpLearningTime, // 修正: xpTime -> xpLearningTime
      icon: <IconClockHour4 size={20} />,
      color: 'blue',
    },
    {
      label: correctnessLabel,
      value: results.xpCorrectness,
      icon: <IconCheck size={20} />,
      color: 'green',
    },
    {
      label: `テスト効果XP (質${(results.qualityScore * 100).toFixed(0)}% × 時間${(results.qualityEffortDurationScore * 100).toFixed(0)}%)`,
      value: results.xpQuality,
      icon: <IconStar size={20} />,
      color: 'grape',
    },
    {
      label: '植物成長XP',
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
          <IconTrophy size={28} style={{ color: theme.text }} />
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
        <Card bg={theme.bgCard} w={'100%'} radius={'lg'}>
          <Stack align="center" gap={4}>
            <Text fz="lg" c={theme.text}>
              獲得した合計XP
            </Text>
            <AnimatedXP targetXP={totalXP} theme={theme} />
          </Stack>

          <Group
            w="100%"
            h={rem(185)}
            bg={theme.bgCard}
            gap={0}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <PlantImageItem
              plant={learningCycle.plant}
              subject={learningCycle.subject}
              style={{ position: 'absolute', bottom: 25 }}
            />
            <DirtMound style={{ position: 'absolute', bottom: 0 }} />
          </Group>
        </Card>

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
                      {React.cloneElement(factor.icon, { c: theme.text })}
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
