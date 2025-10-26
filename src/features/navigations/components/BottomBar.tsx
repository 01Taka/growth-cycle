import React from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';

export const BottomBar: React.FC = () => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        height: 40, // フッターの高さ
        padding: theme.spacing.xs, // 少し小さめのパディング
        backgroundColor: theme.colors.gray[8], // 少し暗めの色
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: theme.fontSizes.sm, // 小さめのフォントサイズ
      }}
    >
      <Text style={{ color: 'white' }}>
        &copy; {new Date().getFullYear()} My Site. All rights reserved.
      </Text>
    </Box>
  );
};
