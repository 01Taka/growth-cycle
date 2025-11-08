import { useComputedColorScheme } from '@mantine/core';
import { RANGE_FORM_COLORS } from './colors';

export const useRangeFormColors = () => {
  const colorScheme = useComputedColorScheme();
  return RANGE_FORM_COLORS[colorScheme];
};
