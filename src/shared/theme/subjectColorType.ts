export type SubjectColorPalette = {
  // テキスト色（変更なし）
  text: { light: string; dark: string };
  // 画面全体、非常に薄い
  bgScreen: { light: string; dark: string };
  // カード、セクション、薄い
  bgCard: { light: string; dark: string };
  // チップ、バッジ、普通（ホバーやアクティブにも使える）
  bgChip: { light: string; dark: string };
  // ボーダー色（変更なし）
  border: { light: string; dark: string };
};

export type ColorRole = 'text' | 'bgScreen' | 'bgCard' | 'bgChip' | 'border';

// 【更新】最も内側のオブジェクト型
export type SubjectColorMap = Record<ColorRole, string>;
