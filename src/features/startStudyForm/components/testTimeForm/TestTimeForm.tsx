import React from 'react';
import { IconCircle } from '@tabler/icons-react';
import { Slider } from '@mantine/core';
import { range } from '@/shared/utils/range';

interface TestTimeFormProps {
  value: number;
  onChange: (value: number) => void;
}

export const TestTimeForm: React.FC<TestTimeFormProps> = ({ value, onChange }) => {
  const minTime = 5;
  const maxTime = 60;
  const step = 5;

  const marks = [...range(minTime, maxTime + 1, step)].map((value) => ({
    value,
    label: `${value}`,
  }));

  return (
    <Slider
      value={value}
      onChange={onChange}
      min={minTime}
      max={maxTime}
      step={step}
      // 1. 目盛り設定
      marks={marks}
      // 2. 色を緑に変更
      color="green"
      // 3. つまみを大きくする設定
      // thumbChildren: つまみの内部に表示する要素を指定
      thumbChildren={<IconCircle size="1.2rem" stroke={3} />}
      // styles: スライダーの各要素にカスタムスタイルを適用
      styles={{
        // ツマミ本体のスタイルを上書き
        thumb: {
          width: '24px', // 幅を大きく
          height: '24px', // 高さを大きく
          backgroundColor: 'var(--mantine-color-green-6)', // 色もカスタム可能
          borderWidth: '3px',
        },
        // トラックの目盛りラベルの位置調整（見栄えを良くするため）
        markLabel: {
          marginTop: '5px',
        },
      }}
    />
  );
};
