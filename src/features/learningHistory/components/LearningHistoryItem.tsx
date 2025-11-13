import React, { useMemo } from 'react'; // useMemo をインポート
import { Box, Card, Flex, Group, Pill, Progress, rem, Stack, Text, Tooltip } from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { getGradeByDifference } from '../functions/history-grade-color-utils';
import { AggregatedSection, DifferenceGrade } from '../types/learning-history-types';

interface LearningHistoryItemProps {
  plant: Plant;
  subject: Subject;
  textbookName: string;
  unitNames: string[];
  fixation: number;
  dateDifferencesFromReview: number[];
  differenceToNextFixedReview: number | null;
  differenceFromLastAttempt: number;
  totalProblemCount: number;
  onCheckDetail: () => void;
}

export const LearningHistoryItem: React.FC<LearningHistoryItemProps> = ({
  plant,
  subject,
  textbookName,
  unitNames,
  fixation,
  totalProblemCount,
  dateDifferencesFromReview,
  differenceToNextFixedReview,
  differenceFromLastAttempt,
  onCheckDetail,
}) => {
  const theme = useSubjectColorMap(subject);

  const isWaitingFixedReview = differenceToNextFixedReview !== null;

  const valuePerSection = totalProblemCount > 0 ? 100 / totalProblemCount : 0;

  // 1. aggregatedSections の計算を useMemo でメモ化する
  const aggregatedSections: AggregatedSection[] = useMemo(() => {
    if (valuePerSection === 0) return [];

    const gradeMap = new Map<number, { value: number; gradeInfo: DifferenceGrade }>();

    dateDifferencesFromReview.forEach((diff) => {
      const grade = getGradeByDifference(diff);

      if (!grade) return;

      const current = gradeMap.get(grade.grade) || { value: 0, gradeInfo: grade };
      current.value += valuePerSection;
      gradeMap.set(grade.grade, current);
    });

    // 2. Mapの値を配列に変換し、降順（grade: 5 -> 1）でソートする
    const sectionsArray = Array.from(gradeMap.values())
      .sort((a, b) => b.gradeInfo.grade - a.gradeInfo.grade)
      .map((item) => ({
        value: item.value,
        color: item.gradeInfo.color,
        description: item.gradeInfo.description,
        striped: item.gradeInfo.grade === 1,
        grade: item.gradeInfo.grade,
      }));

    return sectionsArray;
  }, [dateDifferencesFromReview, valuePerSection]); // 依存配列: これらの値が変わったときだけ再計算する

  return (
    <Card
      w="100%"
      h={110} // 高さを少し上げる
      p="md" // paddingを適切に設定
      bg={theme.bgScreen}
      radius={16}
      onClick={onCheckDetail} // クリックで詳細表示
      style={{
        border: `3px solid ${theme.border}`,
        cursor: 'pointer', // クリック可能であることを示す
      }}
    >
      <Flex align="center" h={'100%'}>
        {/* 左側: Plant Icon */}
        <Stack gap={0} h={'100%'}>
          <Stack align="center" gap={0} h={'100%'} pos={'relative'}>
            <Text size={rem(12)} h={0} style={{ position: 'absolute', top: -6 }}>
              定着度
            </Text>
            <Text size="xl" fw={700} style={{ zIndex: 100 }}>
              {isWaitingFixedReview ? '？' : Math.floor(fixation * 100)}%
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
        <Stack ml="md" w={'100%'} gap="xs">
          {/* 上部: タイトルと情報 */}
          <Flex justify="space-between" align="start" w={'100%'}>
            {/* 左側 Stack: 教科書名とユニット名 */}
            <Stack gap={4}>
              <Text size="md" fw={600} c={theme.text} style={{ lineHeight: 1.2 }}>
                {textbookName}
              </Text>
              <Flex gap={4}>
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

            {/* 右側 Stack: 日数と問題数 */}
            <Stack align="end" gap={4}>
              {/* 復習からの経過日数 */}
              <Pill
                size="sm"
                styles={{
                  label: { color: theme.text, fontWeight: 700 },
                  root: {
                    backgroundColor: theme.bgChip,
                    border: `1px solid ${theme.border}`,
                  },
                }}
              >
                復習から{differenceFromLastAttempt}日
              </Pill>
              {/* 総問題数 */}
              <Pill
                size="sm"
                styles={{
                  label: { color: theme.text, fontWeight: 700 },
                  root: {
                    backgroundColor: theme.bgChip,
                    border: `1px solid ${theme.border}`,
                  },
                }}
              >
                {totalProblemCount}問
              </Pill>
            </Stack>
          </Flex>

          {/* 下部: Progress Bar */}
          <Box w={'100%'}>
            {isWaitingFixedReview ? (
              // 固定復習待ちの場合
              <Group
                w={'100%'}
                bg={'orange'}
                align="center"
                justify="center"
                style={{ borderRadius: 999 }}
              >
                <Text fw={700} c={'#333'}>
                  {differenceToNextFixedReview === 0
                    ? '今日復習'
                    : `復習待ち（${differenceToNextFixedReview}日後）`}
                </Text>
              </Group>
            ) : (
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
                      >
                        {section.value > 15 ? section.description : undefined}
                      </Progress.Section>
                    </Tooltip>
                  ))}
                </>
              </Progress.Root>
            )}
          </Box>
        </Stack>
      </Flex>
    </Card>
  );
};
