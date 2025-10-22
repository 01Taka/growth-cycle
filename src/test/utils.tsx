import React from 'react';
import { render } from '@testing-library/react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';

// MantineThemeOverrideをインポート

/**
 * Context ProviderとMantineProviderでコンポーネントをラップしてレンダリングするユーティリティ。
 *
 * @param ui レンダリングしたいReact要素
 * @param Context テストするContextオブジェクト
 * @param mockContextValue モックされたContextの値
 * @param mantineTheme モックされたMantineテーマの設定（オプション）
 * @returns Testing Libraryのrender結果
 */
export const renderWithContext = <T,>(
  ui: React.ReactElement,
  Context: React.Context<T>,
  mockContextValue: T,
  mantineTheme?: MantineThemeOverride
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider theme={mantineTheme}>
      <Context.Provider value={mockContextValue}>{children}</Context.Provider>
    </MantineProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
};
