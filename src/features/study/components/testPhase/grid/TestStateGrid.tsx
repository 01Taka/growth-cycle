import React from 'react';
import { ActionIcon, Box, Group } from '@mantine/core'; // SimpleGrid を Group に変更
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';
import {
  SELF_EVALUATIONS_CONFIGS,
  SelfEvaluationConfig,
} from '../../../constants/self-evaluations-configs';

/**
 * 配列の長さが targetLength に満たない場合、'unrated' でフィルする関数。
 * @param array - フィル対象の TestSelfEvaluation の配列
 * @param targetLength - 満たしたい配列の目標の長さ
 * @returns フィルされた（または元の） TestSelfEvaluation の配列
 */
export function fillUnrated(
  array: TestSelfEvaluation[],
  targetLength: number
): TestSelfEvaluation[] {
  // 配列の長さが目標の長さ以上であれば、そのまま返す
  if (array.length >= targetLength) {
    return array;
  }

  // 不足している長さを計算
  const fillLength = targetLength - array.length;

  // 'unrated' の配列を作成し、元の配列に結合する
  // Array(fillLength).fill('unrated') で指定数の 'unrated' 要素を持つ配列を作成
  const filler = Array(fillLength).fill('unrated') as TestSelfEvaluation[];

  return [...array, ...filler];
}

interface TestStateGridProps {
  selfEvaluations: TestSelfEvaluation[];
  totalProblemsNumber: number;
  currentProblemIndex: number; // 0-indexed
  onClick: (index: number, selfEvaluation: TestSelfEvaluation) => void; // selfEvaluationは押されたボタンのもの
}

export const TestStateGrid: React.FC<TestStateGridProps> = ({
  selfEvaluations,
  totalProblemsNumber,
  currentProblemIndex,
  onClick,
}) => {
  const evaluations = fillUnrated(selfEvaluations, totalProblemsNumber);
  const BUTTON_SIZE = 36; // 正方形のボタンのサイズ (px)

  return (
    <Box w={'100%'}>
      {/* Group コンポーネントを使用: 
          - wrap="wrap" で幅が足りなくなったら折り返す
          - grow を設定しないことで、各 ActionIcon の幅が固定 (BUTTON_SIZE) になる
      */}
      <Group maw={'100%'} gap={'xs'} wrap="wrap">
        {evaluations.map((evaluation, index) => {
          // 対応する設定を取得
          const config: SelfEvaluationConfig = SELF_EVALUATIONS_CONFIGS[evaluation];

          // 現在の問題かどうかを判定
          const isCurrent = index === currentProblemIndex;
          const isUnrated = evaluation === 'unrated';

          // ボタンのスタイル
          const buttonStyle: React.CSSProperties = {
            backgroundColor: isCurrent
              ? config.bgColor
              : isUnrated
                ? toRGBA(config.bgColor, 0.1)
                : toRGBA(config.bgColor, 0.5),
            color: config.color,
            fontSize: '12px',
            fontWeight: 'bold',
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            border: isCurrent
              ? `3px solid ${config.borderColor}` // 現在の問題は太いボーダー
              : undefined,
            boxSizing: 'border-box', // paddingとborderをwidth/heightに含める
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };

          return (
            <ActionIcon
              key={index}
              variant="filled" // 'filled'で背景色を明確に設定
              size={BUTTON_SIZE} // ActionIconのサイズ指定
              radius={0}
              style={buttonStyle}
              onClick={() => onClick(index, evaluation)} // クリックイベント
              title={`問題 ${index + 1}: ${config.text}`}
            >
              {/* 問題番号を表示 */}
              {index + 1}
            </ActionIcon>
          );
        })}
      </Group>
    </Box>
  );
};
