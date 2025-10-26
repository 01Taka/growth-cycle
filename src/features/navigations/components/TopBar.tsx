import React from 'react';
import { Anchor, Box, Title, useMantineTheme } from '@mantine/core';

export const TopBar: React.FC = () => {
  const theme = useMantineTheme();

  const linkStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: 500,
    textDecoration: 'none',
    padding: '0 16px',
  };

  return (
    <Box
      style={{
        height: 60,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.blue[6],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 左側: ロゴやサイト名 */}
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Title order={3} style={{ color: 'white', margin: 0 }}>
          サイトロゴ
        </Title>
      </Box>

      {/* 右側: ナビゲーションリンク */}
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Anchor href="#" style={linkStyle}>
          ホーム
        </Anchor>
        <Anchor href="#" style={linkStyle}>
          商品
        </Anchor>
        <Anchor href="#" style={linkStyle}>
          サービス
        </Anchor>
        <Anchor href="#" style={linkStyle}>
          お問い合わせ
        </Anchor>
      </Box>
    </Box>
  );
};
