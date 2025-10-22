import React from 'react';
import { Button, Card, Stack, Text } from '@mantine/core';
// 依存するカスタムフックをインポート
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Counter: React.FC = () => {
  // 外部依存フックを使用
  const [count, setCount] = useLocalStorage<number>('app-counter-key', 0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
      <Stack align="center">
        <Text size="xl" fw={700}>
          現在のカウント:
        </Text>
        <Text size="50px" fw={900} color="blue">
          {count}
        </Text>
        <Button onClick={increment} size="lg" fullWidth>
          カウントアップして保存
        </Button>
        <Text size="sm" color="dimmed">
          この値はローカルストレージに保存されます。
        </Text>
      </Stack>
    </Card>
  );
};
