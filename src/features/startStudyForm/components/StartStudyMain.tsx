import React, { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Center, Flex, Loader, Text } from '@mantine/core';
import { StudyHeader } from '@/features/study/components/main/StudyHeader';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { useTextbookStore } from '@/shared/stores/useTextbookStore';
import { createLearningCycle } from '../shared/form/crud-study-data';
import { StartStudyFormValues } from '../shared/form/form-types';
import { StartStudyForm } from './StartStudyForm';

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const textbookId = searchParams.get('textbookId');

  // 1. 💡 Zustandストアから必要な状態とアクションを取得
  const { activeTextbook, getTextbookById, isLoading } = useTextbookStore((state) => state);

  // activeTextbookからデータを取得し、使用しやすい変数に格納
  const textbook = activeTextbook.data;
  const isFound = activeTextbook.isFound;

  const theme = useSubjectColorMap(textbook?.subject ?? 'unselected');

  // 2. 💡 IDが変わるか、初回マウント時にデータをフェッチ
  useEffect(() => {
    if (!textbookId) return; // IDがなければ何もしない

    // IDが存在する場合、getTextbookByIdを実行
    const fetchActiveTextbook = async () => {
      // activeTextbook の更新は getTextbookById の中で行われる
      await getTextbookById(textbookId);
    };

    fetchActiveTextbook();
  }, [textbookId, activeTextbook.id, activeTextbook.isFound, getTextbookById]);

  // 3. フォーム送信ハンドラ
  const handleSubmit = useCallback(
    async (value: StartStudyFormValues) => {
      // 💡 教科書データがない場合は処理を中断
      if (!textbook) {
        console.error('Textbook data is not available for submission.');
        return;
      }

      try {
        const cycleId = await createLearningCycle(textbook.id, value, {
          nextReviewDate: new Date().toISOString().split('T')[0],
          defaultProblemFormat: 'number',
          defaultTimePerProblem: 0,
          isReviewTarget: true,
        });

        navigate(`/study?cycleId=${cycleId}`);
      } catch (error) {
        console.error('Study submission error:', error);
      }
    },
    [textbook] // textbook が変更されたら再生成
  );

  // 4. 💡 ローディング・エラー・データなしの表示
  if (!textbookId) {
    return (
      <Center h={300}>
        <Text style={{ color: 'red' }}>エラー: 教科書IDが指定されていません。</Text>
      </Center>
    );
  }

  // ZustandのisLoadingとactiveTextbookのローディング状態を区別して使用
  if (isLoading || activeTextbook.id !== textbookId) {
    // グローバルローディング中、またはIDが変わった直後のフェッチ中はローディングを表示
    return (
      <Center h={300}>
        <Flex direction="column" align="center" gap="sm">
          <Loader size="xl" />
          <Text>教科書データを読み込み中...</Text>
        </Flex>
      </Center>
    );
  }

  if (!isFound || !textbook) {
    // 💡 TextbookDocument が見つからなかった場合
    return (
      <Center h={300}>
        <Text color="red">エラー: ID "{textbookId}" の教科書が見つかりませんでした。</Text>
      </Center>
    );
  }

  // 5. フォームのレンダリング (データが揃っている場合のみ)
  return (
    <Box p="md" bg={theme.bgScreen}>
      <StudyHeader
        textbookName={textbook.name}
        subject={textbook.subject}
        units={textbook.units.map((unit) => unit.name)}
      />
      <StartStudyForm
        existUnits={textbook.units?.map((unit) => unit.name) ?? []}
        existCategories={textbook.categories?.map((category) => category.name) ?? []}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
};
