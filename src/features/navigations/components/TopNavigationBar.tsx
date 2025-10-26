import React from 'react';
import { AppShell } from '@mantine/core';
import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

// childrenを受け取るようにPropsを定義
interface TopNavigationBarProps {
  children: React.ReactNode;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ children }) => {
  return (
    <AppShell>
      {/* AppShell.Header内で作成したTopBarを呼び出し */}
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>

      {/* AppShell.Footer内で作成したBottomBarを呼び出し */}
      <AppShell.Footer>
        <BottomBar />
      </AppShell.Footer>

      {/* メインコンテンツを AppShell.Main で囲み、propsから受け取った children を表示 */}
      {/* styleでpaddingを設定し、ヘッダーとフッターにコンテンツが隠れないようにします */}
      <AppShell.Main style={{ padding: 'var(--mantine-spacing-md)', paddingTop: 60 }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};
