import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Center, Flex, Loader, Text } from '@mantine/core';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { useTextbookStore } from '@/shared/stores/useTextbookStore';
import { useTextbookFilter } from '../shared/useTextbookFilter';
import { FilterChips } from './filterChip/FilterChips';
import { NewFAB } from './NewFAB';
import { TextbookList } from './TextbookList';

interface TextbookMainProps {}

const PLANT_SIZE_RATIO = 48;

export const TextbookMain: React.FC<TextbookMainProps> = () => {
  const navigate = useNavigate();

  // 💡 Zustandストアから状態とアクションを取得
  const { textbooks, isLoading, error, fetchTextbooks } = useTextbookStore((state) => state);

  // 💡 コンポーネントマウント時にデータをフェッチ
  useEffect(() => {
    // データがまだロードされていない場合のみフェッチを実行
    fetchTextbooks();
  }, [fetchTextbooks]);

  // useTextbookFilter にはストアから取得した textbooks を渡します
  const { selectedSubject, filterData, displayPlant, handleSubjectClick } =
    useTextbookFilter(textbooks);

  // テーマカラーの取得
  const theme = useSubjectColorMap(selectedSubject ?? 'japanese');

  // ナビゲーション関数
  const onSelectTextbook = useCallback(
    (item: TextbookDocument) => {
      navigate(`/start-study?textbookId=${item.id}`);
    },
    [navigate]
  );

  const onCreate = useCallback(() => {
    navigate(`/create-textbook?subject=${selectedSubject ?? 'japanese'}`);
  }, [navigate, selectedSubject]);

  // ローディング中またはエラー時の表示ロジック
  const renderContent = () => {
    if (isLoading) {
      return (
        <Center style={{ height: 'calc(100vh - 200px)' }}>
          <Flex direction="column" align="center" gap="sm">
            <Loader size="xl" />
            <Text>データを読み込み中...</Text>
          </Flex>
        </Center>
      );
    }

    if (error) {
      return (
        <Center style={{ height: 'calc(100vh - 200px)' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </Center>
      );
    }

    // データ取得完了後のリスト表示
    return (
      <TextbookList
        textbookItems={filterData}
        transformScale={displayPlant ? 1 : 0}
        plantSizeRatio={PLANT_SIZE_RATIO}
        onClick={onSelectTextbook}
      />
    );
  };

  return (
    <div>
      {/* フィルタチップの固定ヘッダー */}
      <Card
        shadow="sm"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1000,
          height: 120,
          backgroundColor: 'white',
          padding: 0,
        }}
      >
        <Flex align="center" justify="center" w="100%" h="100%">
          {/* ローディング中はフィルタチップを無効化するか、ローディング後に表示を検討 */}
          <FilterChips
            selectedSubjects={selectedSubject ? [selectedSubject] : []}
            onClickSubject={handleSubjectClick}
          />
        </Flex>
      </Card>

      {/* 教科書リスト本体 */}
      <Box mt={130} mb={130}>
        {renderContent()}
      </Box>

      {/* 新規作成 FAB */}
      <NewFAB onClick={onCreate} style={{ backgroundColor: theme.accent }} />
    </div>
  );
};
