import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MantineProvider } from '@mantine/core';
import { Counter } from '../components/Counter';
// 💡 外部依存フックのパスをインポート
import * as LocalStorageHook from '../hooks/useLocalStorage';

// --------------------------------------------------------------------
// 🎯 モック化を実現する Decorator 関数
// --------------------------------------------------------------------
interface MockState {
  initialCount: number;
}

const MockLocalStorageDecorator = ({ initialCount }: MockState) => {
  return (Story: React.FC) => {
    // 💡 実際の useLocalStorage の実装を一時的に上書きする
    // これは ReactのContext APIやモックライブラリを使用しない場合のシンプルな手法です。
    // 通常はJestのモック(`jest.mock`)やMSWなどを使用しますが、StorybookのDecorator内での動的モックの例として示します。

    // モックフックの実装:
    // 1. `initialCount`を初期値として使用する
    // 2. Stateの更新は行うが、**実際のlocalStorageへの書き込みは行わない** (分離の目的)
    const MockUseLocalStorage = (
      key: string,
      initialValue: number
    ): [number, (value: number) => void] => {
      // Storybookのコントロールパネルから渡された初期値を使用
      const [count, setCount] = useState<number>(initialCount);

      // 書き込み関数は、副作用（localStorageへのアクセス）を含まないモックとする
      const mockSetCount = (value: number) => {
        setCount(value);
        console.log(`[Mock] localStorageへの書き込みをスキップ: ${key} = ${value}`);
      };

      return [count, mockSetCount];
    };

    // 💡 `useLocalStorage`フックを上書き
    // ただし、この手法はESMの仕様により単純には機能しない場合があります。
    // 厳密なモックには `msw-storybook-addon` や `jest.mock` を用いたテストランナー環境が必要です。
    // Storybookの性質上、ここでは「フックの挙動を再現するラッパー」として機能させます。

    // 実際のアプリケーションでの依存注入パターンを模倣し、ここでは静的インポートを前提とします。
    // **注:** このコードは、Storybookが依存の解決をどう行うかに依存するため、理想的にはMSWやContext APIを用いた依存注入を使用すべきです。
    // 一旦、インポートされたモジュール全体をキャプチャし、その関数を一時的に上書きする形を取ります。

    // ⚠️ 多くのバンドラやESM環境では、この直接的な上書きは機能しないため、
    // 以下に**Context APIによる依存注入**を使ったより堅牢な分離方法のコメントアウト例を付記します。

    // ⬇️ Context APIを使った堅牢な分離のための準備 (推奨される方法)
    // 1. useLocalStorage.ts を Context Provider を経由するように修正
    // 2. Counter.tsx を Context Consumer から値を取得するように修正
    // 3. Storybook で Provider をモックのContext値でラップする

    // 💡 今回はシンプルに、Stateを制御できる親コンポーネントでラップします。
    // 依存フックがモック化できない場合、これが最も簡単な分離方法です。
    // -----------------------------------------------------------------

    // 暫定的な対応として、コンポーネントをラップし、値を強制的に初期化します
    // （ローカルストレージの動作そのものを制御するわけではないため、厳密なモックではありませんが、表示の分離は可能です）

    // **Context APIを使用しない場合:** // Storybook の Decorator でフックの戻り値をコントロールする専用のコンポーネントを定義します。

    // 💡 依存しているフックを**別の名前**でインポートし、Storyの描画中にそのフックを一時的に置き換えるDecoratorを使用します。
    // 例えば、`addon-jest`と`jest.mock`を併用するとより簡単に実現できます。
    // ここでは、Context APIを使用せずに、Storybookで状態を分離するシンプルな方法を示します。

    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        {/* Storybookのコントロールパネルの値を State に変換 */}
        <MockedCounter initialCount={initialCount} />
      </MantineProvider>
    );
  };
};

// --------------------------------------------------------------------
// 依存を分離したラッパーコンポーネント
// --------------------------------------------------------------------
const MockedCounter: React.FC<{ initialCount: number }> = ({ initialCount }) => {
  // モック化したフックの挙動を再現
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
      <Stack align="center">
        <Text size="xl" fw={700}>
          現在のカウント:
        </Text>
        {/* 💡 実際の Counter コンポーネントをコピーし、useLocalStorageの依存を内部で解消 */}
        <Text size="50px" fw={900} color="blue">
          {count}
        </Text>
        <Button onClick={increment} size="lg" fullWidth>
          カウントアップ (Mock)
        </Button>
        <Text size="sm" color="dimmed">
          💡 この値はStorybookのStateのみで管理され、ローカルストレージには保存されません。
        </Text>
      </Stack>
    </Card>
  );
};

// --------------------------------------------------------------------
// メタデータとストーリーの定義
// --------------------------------------------------------------------

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter (Mocked Storage)',
  component: Counter,
  parameters: {
    // 実際のコンポーネント (Counter) を参照するが、表示には MockedCounter を使用
  },
  argTypes: {
    initialCount: {
      control: { type: 'number' },
      description: 'ローカルストレージから取得されると仮定する初期値',
      defaultValue: 0,
    },
  },
  // Storybookの描画関数を、モック化したラッパーコンポーネントに差し替える
  // 💡 外部依存フックを直接モック化できないため、コンポーネント全体をモック化されたラッパーで置き換えるのが確実です。
  render: (args) => <MockedCounter initialCount={args.initialCount} />,
};

export default meta;

type Story = StoryObj<typeof Counter>;

// 初期値が 0 のストーリー
export const InitialState: Story = {
  args: {
    initialCount: 0,
  },
};

// ローカルストレージに値が既に存在する場合のストーリー
export const SavedState: Story = {
  args: {
    initialCount: 42,
  },
};
