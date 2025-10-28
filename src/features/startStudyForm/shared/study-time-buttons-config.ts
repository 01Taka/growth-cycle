import { SelectStudyTimeButtonProps } from './shared-props-types';
import { ThemeColor, themes } from './theme';

// --- 外部ファイル (例: button-configs.ts) ---

type ButtonConfig = {
  label: string;
  timeMin: number;
  explanations: string[];
  themeColor: ThemeColor | 'disabled'; // どのテーマを使うか
};

export const STUDY_TIME_BUTTON_CONFIGS: Record<string, ButtonConfig> = {
  compact: {
    label: 'コンパクト',
    timeMin: 15,
    explanations: ['さっと復習', '簡単な単元'],
    themeColor: 'yellow',
  },
  balance: {
    label: 'バランス',
    timeMin: 25,
    explanations: ['予習 / 復習', '新規単元'],
    themeColor: 'blue',
  },
  long: {
    label: 'ロング',
    timeMin: 45,
    explanations: ['じっくり定着', '難しい単元'],
    themeColor: 'red',
  },
};

export const getStudyTimeButtonsProps = (
  colorScheme: 'light' | 'dark'
): ((disabled: boolean) => SelectStudyTimeButtonProps)[] => {
  // Configsを配列に変換し、テーマ適用関数を返す
  return Object.values(STUDY_TIME_BUTTON_CONFIGS).map((config) => {
    return (disabled: boolean) => {
      const actualThemeColor = disabled ? 'disabled' : config.themeColor;

      return {
        ...config,
        theme: themes[colorScheme][actualThemeColor],
      };
    };
  });
};
