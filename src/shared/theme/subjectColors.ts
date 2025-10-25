import { Subject } from '../types/study-shared-types';
import { SubjectColorMap } from './subjectColorType';

export const SUBJECT_COLORS: Record<Subject, Record<'light' | 'dark', SubjectColorMap>> = {
  // --- 1. 国語 (赤ベース) ---
  japanese: {
    light: {
      text: '#2c0000', // 濃い赤茶色 (可読性重視)
      bgScreen: '#ffffff', // 白
      bgCard: '#ffecec', // 非常に薄いピンク (赤のニュアンス)
      bgChip: '#ffcdd2', // 薄い赤/ピンク
      border: '#ef9a9a', // やや明るい赤
    },
    dark: {
      text: '#ffebed', // 非常に薄いピンク (ハイライト)
      bgScreen: '#440000', // 深い赤/マルーン
      bgCard: '#6d1010', // 暗めの赤
      bgChip: '#9e3636', // 中くらいの赤
      border: '#c66767', // やや明るい赤のボーダー
    },
  },

  // --- 2. 数学 (青ベース) ---
  math: {
    light: {
      text: '#0d304e', // 濃いネイビー/インクブルー (可読性重視)
      bgScreen: '#ffffff', // 白
      bgCard: '#f0f8ff', // 非常に薄い水色/スカイブルー
      bgChip: '#b3e5fc', // 明るい水色/ライトブルー
      border: '#81d4fa', // やや明るいスカイブルー
    },
    dark: {
      text: '#e6f7ff', // 非常に薄い水色 (ハイライト)
      bgScreen: '#0d183f', // 非常に濃いディープブルー/インディゴ
      bgCard: '#1a2e63', // 暗めのブルー/ネイビー
      bgChip: '#2b478d', // ミディアムブルー/ロイヤルブルー
      border: '#4569c7', // やや明るいブルーのボーダー
    },
  },

  science: {
    light: {
      text: '#174020', // 濃い森の緑 (可読性重視)
      bgScreen: '#ffffff', // 白
      bgCard: '#f0fff5', // 非常に薄いミントグリーン
      bgChip: '#c8e6c9', // 薄い緑/パステルグリーン
      border: '#a5d6a7', // やや明るいリーフグリーン
    },
    dark: {
      text: '#f0fff0', // 非常に薄いグリーン (ハイライト)
      bgScreen: '#0c3816', // 非常に濃いフォレストグリーン
      bgCard: '#1a5e2a', // 暗めのモスグリーン
      bgChip: '#2b8a41', // ミディアムグリーン/エメラルドグリーン
      border: '#4caf50', // やや明るいグリーンのボーダー
    },
  },

  // --- 4. 社会 (オレンジベース) ---
  socialStudies: {
    light: {
      text: '#5c3300', // 濃い茶色/セピア色 (可読性重視、歴史のイメージ)
      bgScreen: '#ffffff', // 白
      bgCard: '#fffaf0', // 非常に薄いクリーム色
      bgChip: '#ffe082', // 明るいゴールド/山吹色
      border: '#ffb300', // 鮮やかなオレンジイエロー
    },
    dark: {
      text: '#fff8e1', // 非常に薄いイエロー (ハイライト)
      bgScreen: '#3d2500', // 非常に濃いディープブラウン/アースカラー
      bgCard: '#6e4400', // 暗めのオレンジブラウン
      bgChip: '#a36d1a', // ミディアムなテラコッタ/琥珀色
      border: '#d49830', // やや明るいゴールドブラウンのボーダー
    },
  },

  english: {
    light: {
      text: '#3a0050', // 濃いパープル/インク色 (可読性重視)
      bgScreen: '#ffffff', // 白
      bgCard: '#fcf0ff', // 非常に薄いラベンダー/ライラック
      bgChip: '#e1bee7', // 薄いパステルパープル
      border: '#ce93d8', // やや明るいアメジスト
    },
    dark: {
      text: '#f9f0ff', // 非常に薄いパープル (ハイライト)
      bgScreen: '#260c38', // 非常に濃いディープバイオレット/インディゴ
      bgCard: '#451a69', // 暗めのパープル/ナス紺
      bgChip: '#6e2b9c', // ミディアムなロイヤルパープル
      border: '#9c54d3', // やや明るいバイオレットのボーダー
    },
  },
};
