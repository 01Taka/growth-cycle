import { DefaultMantineColor } from '@mantine/core';

export interface DifferenceGrade {
  grade: number;
  maxDifferenceDays: number;
  color: DefaultMantineColor;
  description: string;
}

export interface AggregatedSection {
  value: number;
  color: string;
  description: string;
  striped: boolean;
}
