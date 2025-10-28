import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { ThemeColor, themes } from './theme';

export const useTheme = () => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  return (themeColor: ThemeColor) => themes[colorScheme][themeColor];
};
