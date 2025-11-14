import React from 'react';
import { Box, Grid, GridCol } from '@mantine/core';

interface ReviewedCycleCardProps {}

export const ReviewedCycleCard: React.FC<ReviewedCycleCardProps> = ({}) => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Grid>
      {items.map((item) => (
        <GridCol span={4} key={item}>
          <Box
            style={{
              height: 50,
              backgroundColor: '#e7f5ff', // 背景色を付けて見やすく
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ced4da',
            }}
          >
            Item {item}
          </Box>
        </GridCol>
      ))}
    </Grid>
  );
};
