import React from 'react';
import { IconCircle } from '@tabler/icons-react';
import { Slider } from '@mantine/core';

// スライダーの目盛り設定
const marks = [
  { value: 5, label: '5分' },
  { value: 10, label: '10分' },
  { value: 15, label: '15分' }, // デフォルト値の近く
  { value: 20, label: '20分' },
  { value: 25, label: '25分' },
  { value: 30, label: '30分' },
];

interface TestTimeFormProps {
  value: number;
  onChange: (value: number) => void;
}

export const TestTimeForm: React.FC<TestTimeFormProps> = ({ value, onChange }) => {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={5}
      max={30}
      step={5}
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
