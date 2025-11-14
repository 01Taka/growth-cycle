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
    // --- 未定義/N/A 用のキーを追加 (例: "-1") ---
    '-1': {
      background: '#f3f4f6', // Light gray background
      text: '#4b5563', // Dark gray text
      border: '#d1d5db', // Medium gray border
      accent: '#9ca3af', // Accent gray
      reverseText: '#1f2937', // Nearly black for good contrast
      label: 'N/A (不明)',
    },
    // ------------------------------------
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
    // --- 未定義/N/A 用のキーを追加 (例: "-1") ---
    '-1': {
      background: '#374151', // Darker gray background
      text: '#e5e7eb', // Light gray text
      border: '#6b7280', // Medium-dark gray border
      accent: '#9ca3af', // Accent gray
      reverseText: '#1f2937', // Nearly black for good contrast
      label: 'N/A (不明)',
    },
    // ------------------------------------
  },
};
