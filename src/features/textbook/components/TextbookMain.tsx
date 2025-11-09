import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Center, Flex, Loader, Text } from '@mantine/core';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { getTextbooks } from '../functions/curd-textbook';
import { useTextbookFilter } from '../shared/useTextbookFilter';
import { FilterChips } from './filterChip/FilterChips';
import { NewFAB } from './NewFAB';
import { TextbookList } from './TextbookList';

interface TextbookMainProps {}

export const TextbookMain: React.FC<TextbookMainProps> = () => {
  const navigate = useNavigate();

  // 1. 💡 教科書データを保持する state とローディング state を定義
  const [textbooks, setTextbooks] = useState<TextbookDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. 💡 useEffect 内で非同期処理を実行
  useEffect(() => {
    let isMounted = true; // クリーンアップのためのフラグ

    const fetchTextbooks = async () => {
      try {
        // ローディング開始
        setIsLoading(true);
        setError(null);

        // 非同期でデータ取得
        const data = await getTextbooks();

        // コンポーネントがマウントされている場合のみ状態を更新
        if (isMounted) {
          setTextbooks(data);
        }
      } catch (e) {
        console.error('Failed to fetch textbooks:', e);
        if (isMounted) {
          setError('データの読み込みに失敗しました。');
          setTextbooks([]); // エラー時はデータを空にする
        }
      } finally {
        if (isMounted) {
          // ローディング終了
          setIsLoading(false);
        }
      }
    };

    fetchTextbooks();

    // クリーンアップ関数: アンマウント時にフラグをfalseにし、setStateを防止
    return () => {
      isMounted = false;
    };
  }, []); // 依存配列が空なので、初回マウント時のみ実行

  // 💡 カスタムフックを使用してロジックを取得
  // useTextbookFilter は TextbookDocument[] を受け取るように修正されている必要があります
  const { selectedSubject, filterData, displayPlant, handleSubjectClick } =
    useTextbookFilter(textbooks);

  // テーマカラーの取得
  const theme = useSubjectColorMap(selectedSubject ?? 'japanese');

  // ナビゲーション関数
  const onSelectTextbook = useCallback(
    (item: TextbookDocument) => {
      navigate('/start-study');
    },
    [navigate]
  );

  const onCreate = useCallback(() => {
    navigate(`/create-textbook?subject=${selectedSubject ?? 'japanese'}`);
  }, [navigate, selectedSubject]);

  // 3. 💡 ローディング中またはエラー時の表示
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
        // filterData は TextbookItemProps[] または TextbookDocument[] のいずれかである必要があります
        textbookItems={filterData}
        sizeRatio={displayPlant ? 1 : 0}
        onClick={onSelectTextbook}
      />
    );
  };

  // フィルタチップのヘッダー部分はデータに依存しないため、そのまま表示

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
