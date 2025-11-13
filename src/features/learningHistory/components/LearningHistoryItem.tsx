import React, { useState } from 'react';
import { IconRun } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Collapse,
  Flex,
  Group,
  Pill,
  Progress,
  rem,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { UTIL_STYLES } from '@/shared/styles/shared-styles';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { getColorByRatio } from '../functions/history-grade-color-utils';
import { useAggregatedSections } from '../hooks/useAggregatedSections';

interface LearningHistoryItemProps {
  plant: Plant;
  subject: Subject;
  textbookName: string;
  unitNames: string[];
  fixation: number;
  dateDifferencesFromReview: number[];
  differenceToNextFixedReview: number | null;
  differenceFromLastAttempt: number;
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
  onCheckDetail: () => void;
}

export const LearningHistoryItem: React.FC<LearningHistoryItemProps> = ({
  plant,
  subject,
  textbookName,
  unitNames,
  fixation,
  dateDifferencesFromReview,
  differenceToNextFixedReview,
  differenceFromLastAttempt,
  testTargetProblemCount,
  estimatedTestTimeMin,
  onCheckDetail,
}) => {
  const [openedDetail, setOpenedDetail] = useState(false);

  const actionColor = getColorByRatio(fixation);

  const neutralTheme = {
    // 枠線は薄いグレー（科目色ではなく統一）
    border: '#767676ff',
    // 背景は白に近い色で統一
    bgScreen: '#FFFFFF',
    // テキストは濃い色で統一
    text: '#333333',
    // ピルの背景は非常に薄いグレー
    bgChip: '#F5F5F5',
  };
  const theme = neutralTheme;
  // ----------------------------------------------------

  const isWaitingFixedReview = differenceToNextFixedReview !== null;

  const aggregatedSections = useAggregatedSections(dateDifferencesFromReview);

  return (
    <Card
      shadow="sm"
      w="100%"
      p="md"
      bg={theme.bgScreen}
      radius={16}
      onClick={onCheckDetail}
      style={{
        border: `2px solid ${theme.border}`,
        cursor: 'pointer',
      }}
    >
      <Flex align="center" h={80}>
        {/* 左側: 定着度とPlant Icon */}
        <Stack gap={0} h={'100%'}>
          <Stack align="center" gap={0} h={'100%'} pos={'relative'}>
            <Text size="xl" fw={700} style={{ zIndex: 100 }}>
              {-differenceFromLastAttempt}日前
            </Text>
          </Stack>
          <Box h={'50%'}>
            <PlantWithEffect
              plant={plant}
              subject={subject}
              auraEffect={{
                blurRadius: 18,
                opacity: 0.5,
              }}
            />
          </Box>
        </Stack>

        {/* 中央・右側: Text & Progress */}
        <Stack ml="md" w={'100%'} gap={0} flex={1} miw={0}>
          {/* 上部: タイトルと情報 */}
          <Flex justify="space-between" align="start" w={'100%'}>
            {/* 左側 Stack: 教科書名とユニット名 */}
            <Stack
              flex={1} // 👈 変更点: 残りのスペースをすべて使うようにする
              gap={4}
              justify="space-around"
              h={'100%'}
              miw={0}
              mt={10}
            >
              <Text
                size="md"
                fw={600}
                c={theme.text}
                style={{
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {textbookName}
              </Text>
              <Flex
                gap={4}
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {unitNames.map((unit, index) => (
                  <Pill
                    key={index}
                    size="sm"
                    styles={{
                      label: { color: theme.text, padding: '0 8px', fontWeight: 700 },
                      root: {
                        backgroundColor: theme.bgChip,
                        height: 20,
                        border: `1px solid ${theme.border}`,
                      },
                    }}
                  >
                    {unit}
                  </Pill>
                ))}
              </Flex>
            </Stack>

            <Stack align="end" gap={4} w={80} style={{ flexShrink: 0 }}>
              <ActionIcon
                bg={openedDetail ? actionColor : theme.bgScreen}
                c={openedDetail ? theme.bgScreen : 'gray'}
                size={rem(40)} // 大きなサイズ
                radius="xl" // 角丸を強くして円形に近いデザインに
                aria-label="勉強を開始"
                style={{
                  border: `3px solid ${actionColor}`,
                }}
                onClick={() => setOpenedDetail((prev) => !prev)}
              >
                <IconRun size={26} />
              </ActionIcon>
              <Flex justify="end" gap={1}>
                <Text>{testTargetProblemCount}問</Text>
                <Text>/</Text>
                <Text>{estimatedTestTimeMin}分</Text>
              </Flex>
            </Stack>
          </Flex>

          {/* 下部: Progress Bar */}
          <Box w={'100%'}>
            {isWaitingFixedReview ? (
              // 固定復習待ちの場合
              <Group
                w={'100%'}
                bg={'#FF8C00'}
                align="center"
                justify="center"
                h={rem(20)}
                style={{ borderRadius: rem(10), minHeight: rem(20) }}
              >
                <Text fw={700} c={'#FFFFFF'}>
                  {/* 見やすいようにテキスト色を白に */}
                  {differenceToNextFixedReview === 0
                    ? '今日復習'
                    : `復習待ち（${differenceToNextFixedReview}日後）`}
                </Text>
              </Group>
            ) : (
              <Box w={'100%'} pos={'relative'}>
                <Progress.Root
                  size="xl"
                  radius="lg"
                  h={rem(20)}
                  style={{ position: 'relative', overflow: 'visible' }}
                >
                  <>
                    {aggregatedSections.map((section, index) => (
                      // ツールチップで詳細情報を表示
                      <Tooltip
                        key={index}
                        label={`${section.description} (${Math.round(section.value)}%)`}
                        withArrow
                      >
                        <Progress.Section
                          value={section.value}
                          color={section.color}
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            color: '#333',
                            fontWeight: 500,
                          }}
                          striped={section.striped}
                          animated={section.striped}
                        />
                      </Tooltip>
                    ))}
                  </>
                </Progress.Root>
                <Flex
                  align="center"
                  gap={5}
                  style={{
                    ...UTIL_STYLES.absoluteCenter,
                  }}
                >
                  <Text fw={600} c={'#333'} size="md">
                    定着度:
                  </Text>
                  <Text fw={700} c={'#333'} size="xl">
                    {Math.floor(fixation * 100)}%
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>
        </Stack>
      </Flex>

      <Collapse in={openedDetail}>
        <Flex
          mt="md"
          p="md"
          bg="#F8F8F8"
          style={{
            borderRadius: '8px',
          }}
          align="center"
          justify="space-between"
        >
          {/* 左側 Stack: 情報の整理 */}
          <Stack gap={3}>
            <Text size="md" fw={700} c={'#333'}>
              問題数:
              <Text span fw={700} c={actionColor}>
                {testTargetProblemCount}
              </Text>
              問
            </Text>
            <Text size="md" fw={700} c={'#333'}>
              推定時間:
              <Text span fw={700} c={'#555'}>
                {estimatedTestTimeMin}
              </Text>
              分
            </Text>
          </Stack>

          {/* 右側 Button: アクションの強調 */}
          <Button
            size="md"
            w={'45%'}
            bg={actionColor}
            c={'white'}
            style={{ transition: 'background-color 0.2s' }}
          >
            復習開始
          </Button>
        </Flex>
      </Collapse>
    </Card>
  );
};
