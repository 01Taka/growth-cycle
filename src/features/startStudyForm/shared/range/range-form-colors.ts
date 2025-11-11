import { RangeFormColors } from './range-form-types';

export const RANGE_FORM_COLORS: RangeFormColors = {
  // ☀️ ライトモード
  light: {
    // 範囲 (Pastel Orange)
    range: {
      background: '#FFD1A6',
      accent: '#D9480F',
      text: '#495057',
      border: '#FFD1A6',
      button: '#D9480F', // ボタン背景 (濃いオレンジ)
      buttonText: '#FFFFFF', // NEW: 白 (濃いオレンジ背景に対して視認性高)
    },
    // 個別 (Pastel Blue)
    individual: {
      background: '#A6E1FF',
      accent: '#1C7ED6',
      text: '#495057',
      border: '#A6E1FF',
      button: '#1C7ED6', // ボタン背景 (濃いブルー)
      buttonText: '#FFFFFF', // NEW: 白 (濃いブルー背景に対して視認性高)
    },
    // 競合 (Pastel Red/Warning)
    conflict: {
      background: '#FFF0F0',
      accent: '#FA5252',
      text: '#495057',
      border: '#FFA3A3',
      button: '#FA5252', // ボタン背景 (明るいレッド)
      buttonText: '#FFFFFF', // NEW: 白 (明るいレッド背景に対して視認性高)
    },
    // 無効化 (Pastel Gray)
    disabled: {
      background: '#E9ECEF',
      accent: '#ADB5BD',
      text: '#ADB5BD',
      border: '#E9ECEF',
      button: '#ADB5BD',
      buttonText: '#495057', // NEW: 濃いグレー (明るいグレー背景に対して視認性高)
    },
    // 追加タイトル (Pastel Blue Emphasis)
    addTitle: {
      accent: '#4DABF7',
    },
  },

  // 🌙 ダークモード
  dark: {
    // 範囲 (Pastel Orange)
    range: {
      background: '#944D0D',
      accent: '#FFD1A6',
      text: '#E9ECEF',
      border: '#944D0D',
      button: '#944D0D', // ボタン背景 (暗めのオレンジ)
      buttonText: '#E9ECEF', // NEW: 淡いグレー (暗めの背景に対して視認性高)
    },
    // 個別 (Pastel Blue)
    individual: {
      background: '#154876',
      accent: '#A6E1FF',
      text: '#E9ECEF',
      border: '#154876',
      button: '#154876', // ボタン背景 (暗めのブルー)
      buttonText: '#E9ECEF', // NEW: 淡いグレー (暗めの背景に対して視認性高)
    },
    // 競合 (Pastel Red/Warning)
    conflict: {
      background: '#3A0808',
      accent: '#FFA3A3',
      text: '#E9ECEF',
      border: '#820C0C',
      button: '#820C0C', // ボタン背景 (Darker Red)
      buttonText: '#E9ECEF', // NEW: 淡いグレー (暗めの背景に対して視認性高)
    },
    // 無効化 (Dark Gray)
    disabled: {
      background: '#343A40',
      accent: '#868E96',
      text: '#ADB5BD',
      border: '#343A40',
      button: '#343A40',
      buttonText: '#ADB5BD', // NEW: 中程度のグレー (暗めの背景に対して視認性高)
    },
    // 追加タイトル (Pastel Blue Emphasis)
    addTitle: {
      accent: '#74C0FC',
    },
  },
};
