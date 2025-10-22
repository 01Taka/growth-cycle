import React from 'react';
import { Button, Card, Group, Text, Title } from '@mantine/core';
// Contextフックをインポート
import { useCounter } from '../context/CounterContext';

// コンポーネントが使用するストレージのキーとインクリメント量を定義
const STORAGE_KEY = 'app_user_count';
const INCREMENT_AMOUNT = 1;

/**
 * ローカルストレージに保存された値を表示し、インクリメントするコンポーネント。
 */
export const Counter: React.FC = () => {
  // Contextから useCounterStorage フックの参照を取得
  const { useCounterStorage } = useCounter();

  // 取得したフック参照にキーと初期値を渡して呼び出す
  const [count, updateCount] = useCounterStorage(STORAGE_KEY, 0);

  // カウントアップ処理
  const handleIncrement = () => {
    updateCount(INCREMENT_AMOUNT);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 300, margin: 'auto' }}>
      <Title order={2} ta="center" mb="md">
        ローカルストレージカウンター
      </Title>

      <Group justify="center" mb="lg">
        <Text size="xl" fw={700} c="blue">
          現在の値:
        </Text>
        <Text size="3rem" fw={900} style={{ fontFamily: 'monospace' }}>
          {count}
        </Text>
      </Group>

      <Button fullWidth size="lg" onClick={handleIncrement} variant="filled">
        +{INCREMENT_AMOUNT} カウントアップして保存
      </Button>

      <Text size="sm" c="dimmed" mt="md" ta="center">
        ※この値はブラウザのローカルストレージに保存されます。
      </Text>
    </Card>
  );
};
