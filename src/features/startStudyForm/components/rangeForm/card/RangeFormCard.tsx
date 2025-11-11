import React, { useState } from 'react';
import { Card, ComboboxItem, Stack } from '@mantine/core';
import { RangeFormCardManagerPropsBase } from '../../../shared/range/range-form-types';
import { useRangeFormColors } from '../../../shared/range/useRangeFormColors';
import { RangeFormHeader } from './RangeFormHeader';
import { RangeSummaryAndConflict } from './RangeSummaryAndConflict';
import { RangeValueInputArea } from './RangeValueInputArea';

interface RangeFormCardProps extends RangeFormCardManagerPropsBase {
  unitHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  categoryHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  valueMin?: number;
  valueMax?: number;
}

export const RangeFormCard: React.FC<RangeFormCardProps> = ({
  unitForm,
  categoryForm,
  unitHandler,
  categoryHandler,
  hasConflict,
  ranges,
  valueMin = 1,
  valueMax = Number.MAX_SAFE_INTEGER,
  onRemoveRange,
  onAddRange,
  onResolveConflict,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colors = useRangeFormColors();

  // 範囲・個別値の入力状態を親で管理
  const [rangeStart, setRangeStart] = useState<number | ''>('');
  const [rangeEnd, setRangeEnd] = useState<number | ''>('');
  const [individualValue, setIndividualValue] = useState<string>('');

  // 値の制限ロジック
  const clamp = (
    value: number | string,
    min: number = valueMin,
    max: number = valueMax
  ): number | '' => {
    if (value === '') {
      return '';
    }
    const num = Number(value);
    // NaNまたは数値でない場合は空文字列を返す
    if (isNaN(num)) return '';
    // 値を最小値と最大値の間に制限する
    const clampedValue = Math.min(Math.max(num, min), max);

    // `setRangeStart`や`setRangeEnd`に渡せるように`number`型または`''`型を返す
    return clampedValue;
  };

  // 範囲の追加ハンドラ
  const handleAddRangeValue = () => {
    if (rangeStart !== '' && rangeEnd !== '' && rangeStart <= rangeEnd) {
      onAddRange({ start: rangeStart, end: rangeStart !== rangeEnd ? rangeEnd : undefined });
      setRangeStart('');
      setRangeEnd('');
    }
  };

  // 個別値の追加ハンドラ
  const handleAddIndividualValue = () => {
    if (individualValue.trim() !== '') {
      const values = individualValue
        .split(',')
        .map((v) => parseInt(v.trim()))
        .filter((num) => !isNaN(num) && num >= valueMin && num <= valueMax);

      values.forEach((num) => {
        onAddRange({ start: num });
      });

      setIndividualValue('');
    }
  };

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      shadow="md"
      bg={'#fafbe3ff'}
      style={{ border: `2px solid #999c00` }}
    >
      <Stack gap="lg">
        {/* 1. 教科・カテゴリ選択 (Header) */}
        <RangeFormHeader
          unitForm={unitForm}
          categoryForm={categoryForm}
          unitHandler={unitHandler}
          categoryHandler={categoryHandler}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* 2. 現在の範囲指定サマリーと競合解決エリア */}
        <RangeSummaryAndConflict
          ranges={ranges}
          hasConflict={hasConflict}
          isCollapsed={isCollapsed}
          onRemoveRange={onRemoveRange}
          onResolveConflict={onResolveConflict}
          colors={colors}
        />

        {/* 3 & 4. 範囲追加・個別番号追加セクション */}
        <RangeValueInputArea
          isCollapsed={isCollapsed}
          valueMin={valueMin}
          valueMax={valueMax}
          rangeStart={rangeStart}
          setRangeStart={setRangeStart}
          rangeEnd={rangeEnd}
          setRangeEnd={setRangeEnd}
          individualValue={individualValue}
          setIndividualValue={setIndividualValue}
          onAddRangeValue={handleAddRangeValue}
          handleAddIndividualValue={handleAddIndividualValue}
          clamp={clamp}
          colors={colors}
        />
      </Stack>
    </Card>
  );
};
