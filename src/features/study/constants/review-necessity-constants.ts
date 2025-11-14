export interface NecessityColorSet {
  background: string;
  text: string;
  border: string;
  accent: string;
  reverseText: string;
  label: string;
}

export const REVIEW_NECESSITY_COLORS: {
  light: {
    [key: number]: NecessityColorSet;
  };
  dark: {
    [key: number]: NecessityColorSet;
  };
} = {
  light: {
    0: {
      background: '#dcfce7',
      text: '#166534',
      border: '#86efac',
      accent: '#22c55e',
      reverseText: '#ffffff',
      label: 'OK',
    },
    1: {
      background: '#fef9c3',
      text: '#854d0e',
      border: '#fde047',
      accent: '#facc15',
      reverseText: '#713f12',
      label: '注意',
    },
    2: {
      background: '#fed7aa',
      text: '#9a3412',
      border: '#fb923c',
      accent: '#f97316',
      reverseText: '#ffffff',
      label: '要確認',
    },
    3: {
      background: '#f3e8ff',
      text: '#6b21a8',
      border: '#c084fc',
      accent: '#a855f7',
      reverseText: '#ffffff',
      label: '要復習',
    },
  },
  dark: {
    0: {
      background: '#14532d',
      text: '#bbf7d0',
      border: '#16a34a',
      accent: '#4ade80',
      reverseText: '#052e16',
      label: 'OK',
    },
    1: {
      background: '#713f12',
      text: '#fef08a',
      border: '#eab308',
      accent: '#fde047',
      reverseText: '#422006',
      label: '注意',
    },
    2: {
      background: '#7c2d12',
      text: '#fed7aa',
      border: '#f97316',
      accent: '#fb923c',
      reverseText: '#431407',
      label: '要確認',
    },
    3: {
      background: '#581c87',
      text: '#e9d5ff',
      border: '#a855f7',
      accent: '#c084fc',
      reverseText: '#3b0764',
      label: '要復習',
    },
  },
};
