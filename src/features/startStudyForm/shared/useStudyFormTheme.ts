import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { STUDY_FORM_COLORS, ThemeColor } from './components-constants/study-form-colors';

export const useStudyFormTheme = () => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  return (themeColor: ThemeColor) => STUDY_FORM_COLORS[colorScheme][themeColor];
};
