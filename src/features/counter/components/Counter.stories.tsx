import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { MantineProvider } from '@mantine/core';
// モック関数 fn をインポート

import { CounterContext } from '../context/CounterContext';
import { createMockCounterContextValue } from '../test/mocks/useCounterStorageMock';
import { Counter } from './Counter';

// ------------------------------------
// 🧪 モック設定（テストとストーリーで共有）
// ------------------------------------
// setAmountMockをfn()として定義し、呼び出しを追跡可能にする
const setAmountMock = fn((incrementAmount: number) => {
  console.log(
    `[Mock Storage] ${incrementAmount}だけインクリメントされました (LocalStorageには書き込みません)`
  );
});

// Storybookの初期値として 5 を設定 (Vitestテストケースの初期値 5 に合わせる)
const MOCK_INITIAL_COUNT = 5;

const mockContextValue = createMockCounterContextValue(MOCK_INITIAL_COUNT, setAmountMock);

// ------------------------------------
// ⚙️ Meta定義
// ------------------------------------
const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  decorators: [
    (Story) => (
      <MantineProvider>
        {/* モックContext ValueをProviderに渡す */}
        <CounterContext.Provider value={mockContextValue}>
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <Story />
          </div>
        </CounterContext.Provider>
      </MantineProvider>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ローカルストレージの値を表示・更新するカウンタコンポーネント。コンテキスト経由でストレージフックを利用します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Counter>;

// ------------------------------------
// 📖 ストーリー定義
// ------------------------------------

/**
 * モックされた初期値（5）で表示されるカウンタ。
 * これが最も基本的な表示状態となります。
 */
export const DefaultState: Story = {
  args: {},
  // play関数がない場合、Storybook Test Runnerはレンダリングエラーがないかを確認します (スモークテスト)。
};

/**
 * 💡 Vitestから移動したテスト内容を含むストーリー（インタラクションテスト）。
 * 初期値の表示と、ボタンクリック時のフック呼び出しを検証します。
 */
export const InteractionTest: Story = {
  args: {},
  parameters: {
    // テスト前に setAmountMock の呼び出し回数をリセット
    // Vitestの vi.fn().mockClear() と同等の処理
    hooks: {
      beforeEach: () => {
        setAmountMock.mockClear();
      },
    },
    docs: {
      description: {
        story: '初期値の表示、およびボタンクリック時のモックフックの呼び出しを検証します。',
      },
    },
  },
  // 💡 play関数内に、従来の Counter.test.tsx のロジックを移植
  play: async ({ canvasElement }) => {
    // canvasElement (StorybookのDOM) からクエリを検索
    const canvas = within(canvasElement);

    // 1. 初期値の表示確認 (従来のテストケース 1 の内容)
    // 初期値 MOCK_INITIAL_COUNT (5) が表示されていることを確認
    // 💡 screen.getByText('5') に相当
    const countDisplay = await canvas.findByText(MOCK_INITIAL_COUNT.toString());
    await expect(countDisplay).toBeInTheDocument();

    // 2. カウントアップ処理のテスト (従来のテストケース 2 の内容)
    // 💡 screen.getByRole に相当
    const button = canvas.getByRole('button', { name: /カウントアップして保存/i });

    // ユーザー操作のシミュレーション
    await userEvent.click(button);

    // 3. 検証
    // Counter.tsxの定義に基づき、インクリメント量 1 が渡されたことを検証
    await expect(setAmountMock).toHaveBeenCalledWith(1);
    await expect(setAmountMock).toHaveBeenCalledTimes(1);

    // UIはモックにより変わらないため、初期値のままのはず
    await expect(countDisplay).toHaveTextContent(MOCK_INITIAL_COUNT.toString());
  },
};
