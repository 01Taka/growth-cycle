// カラーセットの型定義
export interface NecessityColorSet {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  reverseTextColor: string;
  label: string;
}

export const ReviewNecessityColors: {
  light: {
    [key: number]: NecessityColorSet;
  };
  dark: {
    [key: number]: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      accentColor: string;
      reverseTextColor: string;
      label: string;
    };
  };
} = {
  light: {
    0: {
      backgroundColor: '#dcfce7',
      textColor: '#166534',
      borderColor: '#86efac',
      accentColor: '#22c55e',
      reverseTextColor: '#ffffff',
      label: 'OK',
    },
    1: {
      backgroundColor: '#fef9c3',
      textColor: '#854d0e',
      borderColor: '#fde047',
      accentColor: '#facc15',
      reverseTextColor: '#713f12',
      label: '注意',
    },
    2: {
      backgroundColor: '#fed7aa',
      textColor: '#9a3412',
      borderColor: '#fb923c',
      accentColor: '#f97316',
      reverseTextColor: '#ffffff',
      label: '要確認',
    },
    3: {
      backgroundColor: '#f3e8ff',
      textColor: '#6b21a8',
      borderColor: '#c084fc',
      accentColor: '#a855f7',
      reverseTextColor: '#ffffff',
      label: '要復習',
    },
  },
  dark: {
    0: {
      backgroundColor: '#14532d',
      textColor: '#bbf7d0',
      borderColor: '#16a34a',
      accentColor: '#4ade80',
      reverseTextColor: '#052e16',
      label: 'OK',
    },
    1: {
      backgroundColor: '#713f12',
      textColor: '#fef08a',
      borderColor: '#eab308',
      accentColor: '#fde047',
      reverseTextColor: '#422006',
      label: '注意',
    },
    2: {
      backgroundColor: '#7c2d12',
      textColor: '#fed7aa',
      borderColor: '#f97316',
      accentColor: '#fb923c',
      reverseTextColor: '#431407',
      label: '要確認',
    },
    3: {
      backgroundColor: '#581c87',
      textColor: '#e9d5ff',
      borderColor: '#a855f7',
      accentColor: '#c084fc',
      reverseTextColor: '#3b0764',
      label: '要復習',
    },
  },
};
