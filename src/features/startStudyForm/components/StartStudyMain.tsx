import React from 'react';
import { Button } from '@mantine/core';
import { StartStudyForm } from './StartStudyForm';
import { TestModeForm } from './testModeForm/TestModeForm';
import { UnitForm } from './unitForm/UnitForm';
import classes from './MyComponent.module.css';

interface StartStudyMainProps {}

export const StartStudyMain: React.FC<StartStudyMainProps> = ({}) => {
  return (
    <div>
      <StartStudyForm />
      <UnitForm />
      <TestModeForm selectedMode={null} />
      <Button
        className={classes.button}
        styles={(theme) => ({
          // 'root' は Button コンポーネントの最も外側の要素を指す
          root: {
            // 通常の状態のスタイル
            backgroundColor: theme.colors.red[6],

            // ホバー状態のスタイル
            '&:hover': {
              backgroundColor: theme.colors.red[8],
            },
          },
        })}
      >
        ホバーしてね
      </Button>
    </div>
  );
};
