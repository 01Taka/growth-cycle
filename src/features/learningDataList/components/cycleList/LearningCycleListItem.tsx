import React from 'react';
import { Box, Card, Collapse, Flex, Stack } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import {
  CYCLE_LIST_ITEM_COLORS,
  CYCLE_LIST_ITEM_TEXTS,
} from '../../constants/cycle-list-item-constants';
import { CycleListItemAggregatedSection } from '../../types/cycle-list-types';
import { ActionButton } from './itemParts/ActionButton';
import { DetailSection } from './itemParts/DetailSection';
import { FixationProgress } from './itemParts/FixationProgress';
import { PlantSection } from './itemParts/PlantSection';
import { TextbookInfo } from './itemParts/TextbookInfo';
import { WaitingReviewBanner } from './itemParts/WaitingReviewBanner';

interface LearningCycleListItemProps {
  plant: Plant;
  subject: Subject;
  textbookName: string;
  unitNames: string[];
  fixation: number;
  differenceFromLastAttempt: number;
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
  aggregatedSections: CycleListItemAggregatedSection[];
  actionColor: string;
  differenceToNextFixedReview: number | null;
  isWaitingFixedReview: boolean;
  openedDetail: boolean;
  toggleOpenedDetail: () => void;
  onStartReview: () => void;
  onCheckAndSelectProblems: () => void;
}

export const LearningCycleListItem: React.FC<LearningCycleListItemProps> = ({
  plant,
  subject,
  textbookName,
  unitNames,
  differenceToNextFixedReview,
  differenceFromLastAttempt,
  testTargetProblemCount,
  estimatedTestTimeMin,
  openedDetail,
  fixation,
  aggregatedSections,
  actionColor,
  isWaitingFixedReview,
  toggleOpenedDetail,
  onStartReview,
  onCheckAndSelectProblems,
}) => {
  const theme = CYCLE_LIST_ITEM_COLORS;

  return (
    <Card
      shadow="sm"
      w="100%"
      p="md"
      bg={theme.bgScreen}
      radius={16}
      style={{
        border: `2px solid ${theme.border}`,
        cursor: 'pointer',
      }}
    >
      <Flex align="center" h={80} onClick={toggleOpenedDetail}>
        <PlantSection
          label={CYCLE_LIST_ITEM_TEXTS.daysAgo(differenceFromLastAttempt)}
          plant={plant}
          subject={subject}
        />

        <Stack ml="md" w="100%" gap={0} flex={1} miw={0}>
          <Flex justify="space-between" align="start" w="100%">
            <TextbookInfo
              textbookName={textbookName}
              unitNames={unitNames}
              textColor={theme.text}
              chipBgColor={theme.bgChip}
              borderColor={theme.border}
            />

            <ActionButton
              openedDetail={openedDetail}
              actionColor={actionColor}
              bgColor={theme.bgScreen}
              testTargetProblemCount={testTargetProblemCount}
              estimatedTestTimeMin={estimatedTestTimeMin}
            />
          </Flex>

          <Box w="100%">
            {isWaitingFixedReview ? (
              <WaitingReviewBanner differenceToNextFixedReview={differenceToNextFixedReview} />
            ) : (
              <FixationProgress fixation={fixation} aggregatedSections={aggregatedSections} />
            )}
          </Box>
        </Stack>
      </Flex>

      <Collapse in={openedDetail}>
        <DetailSection
          testTargetProblemCount={testTargetProblemCount}
          estimatedTestTimeMin={estimatedTestTimeMin}
          actionColor={actionColor}
          onStartReview={onStartReview}
          onCheckAndSelectProblems={onCheckAndSelectProblems}
        />
      </Collapse>
    </Card>
  );
};
