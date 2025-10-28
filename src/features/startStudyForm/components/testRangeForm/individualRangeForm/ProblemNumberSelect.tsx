import React, { CSSProperties } from 'react';
import {
  InputVariant,
  MantineStyleProp,
  MantineTheme,
  Select,
  SelectProps,
  SelectStylesNames,
  StylesApiProps,
} from '@mantine/core';
import { rangeAsStringArray } from '@/shared/utils/range';

interface ProblemNumberSelectProps {
  value: number;
  maxProblemNumber: number;
  label?: string;
  onChange: (value: number) => void;
  onExpansionMaxProblemNumber: () => void;
  style?: MantineStyleProp;
  styles?:
    | Partial<Record<SelectStylesNames, CSSProperties>>
    | ((
        theme: MantineTheme,
        props: SelectProps,
        ctx: unknown
      ) => Partial<Record<SelectStylesNames, CSSProperties>>)
    | undefined;
}

export const ProblemNumberSelect: React.FC<ProblemNumberSelectProps> = ({
  value,
  label,
  maxProblemNumber,
  onChange,
  onExpansionMaxProblemNumber,
  style,
  styles,
}) => {
  return (
    <Select
      label={label}
      placeholder="選択してください"
      value={value.toString()}
      style={{ ...style }}
      styles={{ ...styles }}
      data={[
        ...rangeAsStringArray(1, maxProblemNumber + 1),
        { value: 'expansion', label: 'もっとみる' },
      ]}
      onChange={(value) => {
        if (value === 'expansion') {
          onChange(maxProblemNumber);
          onExpansionMaxProblemNumber();
        } else {
          onChange(Number(value));
        }
      }}
    />
  );
};
