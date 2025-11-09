// StudyLoadingOrError.tsx (新規ファイルとして作成を推奨)

import React from 'react';
import { Center, Flex, Loader, Text } from '@mantine/core';

interface StudyLoadingOrErrorProps {
  isLoading: boolean;
  cycleId: string | null;
  isCycleFound: boolean;
  isTextbookFound: boolean;
  cycleError: string | null;
  textbookError: string | null;
}

const CONTAINER_HEIGHT = 300;

export const StudyLoadingOrError: React.FC<StudyLoadingOrErrorProps> = ({
  isLoading,
  cycleId,
  isCycleFound,
  isTextbookFound,
  cycleError,
  textbookError,
}) => {
  // 1. 💡 ローディング中
  if (isLoading) {
    return (
      <Center h={CONTAINER_HEIGHT}>
        <Flex direction="column" align="center" gap="sm">
          <Loader size="xl" />
          <Text size="lg">学習データを読み込み中...</Text>
        </Flex>
      </Center>
    );
  }

  // 2. 💡 ID不足
  if (!cycleId) {
    return (
      <Center h={CONTAINER_HEIGHT}>
        <Text style={{ color: 'red' }} size="lg">
          エラー: 学習サイクルID (cycleId) が指定されていません。
        </Text>
      </Center>
    );
  }

  // 3. 💡 データ取得エラー
  if (cycleError || textbookError) {
    const errorMsg = cycleError || textbookError;
    return (
      <Center h={CONTAINER_HEIGHT}>
        <Text style={{ color: 'red' }} size="lg">
          データの取得に失敗しました: {errorMsg}
        </Text>
      </Center>
    );
  }

  // 4. 💡 データ未検出 (IDは存在するが、isFoundがfalse)
  if (!isCycleFound) {
    return (
      <Center h={CONTAINER_HEIGHT}>
        <Text style={{ color: 'red' }} size="lg">
          エラー: ID "{cycleId}" の学習サイクルが見つかりませんでした。
        </Text>
      </Center>
    );
  }

  if (!isTextbookFound) {
    return (
      <Center h={CONTAINER_HEIGHT}>
        <Text style={{ color: 'red' }} size="lg">
          エラー: 関連付けられた教科書データが見つかりませんでした。
        </Text>
      </Center>
    );
  }

  // 5. 💡 すべて正常
  return null;
};
