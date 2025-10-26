export type ColorRole =
  | 'text'
  | 'textRevers'
  | 'bgScreen'
  | 'bgCard'
  | 'bgChip'
  | 'border'
  | 'disabled'
  | 'disabledText'
  | 'accent';

// 【更新】最も内側のオブジェクト型
export type SubjectColorMap = Record<ColorRole, string>;
