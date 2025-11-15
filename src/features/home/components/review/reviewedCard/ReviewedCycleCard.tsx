import React from 'react';
import { Grid, GridCol, Stack } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { ReviewedCycleItem } from './ReviewedCycleItem';

interface ReviewedCycleItemType {
  id: string;
  plant: Plant;
  subject: Subject;
  textbookName: string;
  correctRate: number;
}

interface ReviewedCycleCardProps {
  items: ReviewedCycleItemType[];
}

export const ReviewedCycleCard: React.FC<ReviewedCycleCardProps> = ({ items }) => {
  return (
    <Grid>
      {items.map((item) => (
        <GridCol span={4} key={item.id}>
          <Stack
            align="center"
            justify="center"
            style={{
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReviewedCycleItem
              plant={item.plant}
              subject={item.subject}
              textbookName={item.textbookName}
              correctRate={item.correctRate}
            />
          </Stack>
        </GridCol>
      ))}
    </Grid>
  );
};
