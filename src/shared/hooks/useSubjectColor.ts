// src/hooks/useSubjectColor.ts (更新)

import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { SUBJECT_COLORS } from '../theme/subjectColors';
import { ColorRole, SubjectColorMap } from '../theme/subjectColorType';
import { Subject } from '../types/study-shared-types';

// roleが省略された場合のデフォルト値を定義
const DEFAULT_ROLE: ColorRole = 'bgCard';

/**
 * 現在のカラースキームに基づいて、特定の教科の色を返すカスタムフック。
 * roleを省略した場合、デフォルトで 'bgCard' の色が返されます。
 * * @param subject - 取得したい教科のキー ('japanese', 'math' など)
 * @param role - 取得したい色の役割のキー ('bgScreen', 'bgCard' など)。省略可能。
 * @returns HEXカラーコード (string) または 役割マップ (SubjectColorMap)
 */
export function useSubjectColor(subject: Subject, role?: ColorRole): string;
export function useSubjectColor(subject: Subject, role?: ColorRole): string | SubjectColorMap {
  // Mantineから現在の計算されたカラースキーム ('light' または 'dark') を取得
  const colorScheme: MantineColorScheme = useComputedColorScheme();

  // 指定された教科とカラースキームに対応する色のマップを取得
  const colorMap = SUBJECT_COLORS[subject][colorScheme];

  if (role) {
    // roleが指定されている場合、その役割の色を返す
    return colorMap[role];
  } else {
    // roleが省略されている場合、デフォルトの役割の色を返す
    return colorMap[DEFAULT_ROLE];
  }
}

/**
 * SubjectColorMap全体を返すフック (roleを指定しない場合の処理を上書きしないように別定義)
 */
export function useSubjectColorMap(subject: Subject): SubjectColorMap {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  return SUBJECT_COLORS[subject][colorScheme];
}
