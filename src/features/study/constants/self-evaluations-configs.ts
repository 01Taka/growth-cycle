export const SELF_EVALUATION_COLORS = {
  confident: {
    label: '自信あり',
    light: {
      text: '#008919', // Light Mode Text (Dark Green)
      background: '#9BFFA1', // Light Mode Background (Very Light Green)
      border: '#02C67B', // Light Mode Border (Medium Green/Teal)
    },
    dark: {
      text: '#9BFFA1', // Dark Mode Text (Very Light Green for contrast)
      background: '#003303', // Dark Mode Background (Very Dark Green)
      border: '#02C67B', // Dark Mode Border (Keeping border bright/consistent)
    },
  },
  imperfect: {
    label: '不安/曖昧',
    light: {
      text: '#778900ff', // Light Mode Text (Olive Green)
      background: '#fdff9bff', // Light Mode Background (Very Light Yellow/Green)
      border: '#b9d100ff', // Light Mode Border (Lime Green)
    },
    dark: {
      text: '#fdff9bff', // Dark Mode Text (Very Light Yellow/Green for contrast)
      background: '#333700', // Dark Mode Background (Dark Olive/Brown)
      border: '#b9d100ff', // Dark Mode Border (Keeping border bright/consistent)
    },
  },
  notSure: {
    label: '分からない',
    light: {
      text: '#890000', // Light Mode Text (Dark Red)
      background: '#FFC39B', // Light Mode Background (Light Peach/Orange)
      border: '#D12D00', // Light Mode Border (Medium Red/Orange)
    },
    dark: {
      text: '#FFC39B', // Dark Mode Text (Light Peach/Orange for contrast)
      background: '#330000', // Dark Mode Background (Very Dark Red/Maroon)
      border: '#D12D00', // Dark Mode Border (Keeping border bright/consistent)
    },
  },
  unrated: {
    label: '未選択',
    light: {
      text: '#4f4f4f', // Light Mode Text (Dark Gray)
      background: '#dcdcdc', // Light Mode Background (Very Light Gray)
      border: '#878787', // Light Mode Border (Medium Gray)
    },
    dark: {
      text: '#dcdcdc', // Dark Mode Text (Very Light Gray for contrast)
      background: '#1e1e1e', // Dark Mode Background (Very Dark Gray/Near Black)
      border: '#878787', // Dark Mode Border (Keeping border consistent)
    },
  },
} as const;
