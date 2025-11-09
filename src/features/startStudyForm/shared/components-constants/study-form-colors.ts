export type Theme = {
  text: string;
  textSub: string;
  bg: string;
  border: string;
};

export type ThemeColor = 'yellow' | 'blue' | 'red' | 'disabled' | 'lime' | 'pink' | 'cyan';

export type ColorModeThemes = {
  light: Record<ThemeColor, Theme>;
  dark: Record<ThemeColor, Theme>;
};

export const STUDY_FORM_COLORS: ColorModeThemes = {
  // 💡 ライトモードのテーマ
  light: {
    // 🟡 黄色のテーマ (Light) - 既存
    yellow: {
      text: '#444400',
      textSub: '#707030',
      bg: '#FFFFCC',
      border: '#CCCC66',
    },
    // 🔵 青色のテーマ (Light) - 既存
    blue: {
      text: '#003366',
      textSub: '#336699',
      bg: '#E0F7FF',
      border: '#66AACC',
    },
    // 🔴 赤色のテーマ (Light) - 既存
    red: {
      text: '#660000',
      textSub: '#993333',
      bg: '#FFEEEE',
      border: '#CC6666',
    },
    // 🔘 無効状態のテーマ (Light) - 既存
    disabled: {
      text: '#AAAAAA',
      textSub: '#CCCCCC',
      bg: '#F0F0F0',
      border: '#DDDDDD',
    },

    // 🟢 黄緑のテーマ (Light) - 追加
    lime: {
      text: '#225500', // 濃い黄緑系のテキスト
      textSub: '#558833',
      bg: '#E6FFE6', // 非常に薄い黄緑の背景
      border: '#77CC77', // 中程度の黄緑の枠線
    },
    // 🌸 ピンクのテーマ (Light) - 追加
    pink: {
      text: '#660033', // 濃いピンク系のテキスト
      textSub: '#993366',
      bg: '#FFF0F5', // 薄いラベンダーピンクの背景
      border: '#CC77AA', // 中程度のピンクの枠線
    },
    // 🧊 水色のテーマ (Light) - 追加
    cyan: {
      text: '#004455', // 濃い水色/シアン系のテキスト
      textSub: '#337788',
      bg: '#E0FFFF', // 薄いシアン/水色の背景
      border: '#66BBCC', // 中程度の水色の枠線
    },
  },

  // 🌙 ダークモードのテーマ
  dark: {
    // 🟡 黄色のテーマ (Dark) - 既存
    yellow: {
      text: '#FFFFAA',
      textSub: '#DDDD88',
      bg: '#555500',
      border: '#AAAA44',
    },
    // 🔵 青色のテーマ (Dark) - 既存
    blue: {
      text: '#AAEEFF',
      textSub: '#77CCDD',
      bg: '#002244',
      border: '#336699',
    },
    // 🔴 赤色のテーマ (Dark) - 既存
    red: {
      text: '#FFBBBB',
      textSub: '#DD8888',
      bg: '#440000',
      border: '#884444',
    },
    // 🔘 無効状態のテーマ (Dark) - 既存
    disabled: {
      text: '#777777',
      textSub: '#555555',
      bg: '#2C2C2C',
      border: '#444444',
    },

    // 🟢 黄緑のテーマ (Dark) - 追加
    lime: {
      text: '#AAFF88', // 明るい黄緑系のテキスト
      textSub: '#77CC55',
      bg: '#224400', // 暗い黄緑の背景
      border: '#557733',
    },
    // 🌸 ピンクのテーマ (Dark) - 追加
    pink: {
      text: '#FFCCEE', // 明るいピンク系のテキスト
      textSub: '#DD99BB',
      bg: '#440022', // 暗いマゼンタ/ピンクの背景
      border: '#774466',
    },
    // 🧊 水色のテーマ (Dark) - 追加
    cyan: {
      text: '#AAFFFF', // 明るいシアン/水色のテキスト
      textSub: '#77DDDD',
      bg: '#003344', // 暗いシアン/水色の背景
      border: '#337777',
    },
  },
};
