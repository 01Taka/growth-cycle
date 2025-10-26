import '@mantine/core'; // Mantineの型をインポート

// MantineのBoxPropsやその他のコンポーネントのPropsに'css'プロパティを追加
declare module '@mantine/core' {
  export interface BoxProps {
    /**
     * @emotion/react の 'css' プロパティを有効にする
     */
    css?: any;
  }

  // 必要に応じて他のコンポーネントのPropsにも 'css' を追加
  // 例: export interface ButtonProps extends BoxProps { ... }
}

// Global Emotion types for the 'css' prop in JSX
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: any;
    }
  }
}
