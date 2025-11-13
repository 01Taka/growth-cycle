import { Box, MantineColor, MantineStyleProp } from '@mantine/core';

// Propsの型定義を更新
interface DirtMoundProps {
  /** 土台の幅の基準サイズ (px) - widthとして使用 */
  size?: number;
  /** 土台の高さと幅の比率 (height / width) */
  ratio?: number;
  /** 土台の色 */
  color?: MantineColor | string;
  style?: MantineStyleProp;
}

export const DirtMound: React.FC<DirtMoundProps> = ({
  size = 250, // widthのデフォルト値として使用
  ratio = 0.15, // height / width の比率 (50 / 250 = 0.2)
  color = 'brown',
  style,
}) => {
  const width = size;
  const height = size * ratio;

  return (
    <Box
      style={{
        width: width,
        height: height,
        backgroundColor: color,
        // 半楕円形の border-radius の設定
        borderRadius: '50% / 100% 100% 0 0',
        boxShadow: '0 8px 10px -5px rgba(0, 0, 0, 0.4)',
        filter: 'blur(0.5px)',
        ...style,
      }}
    ></Box>
  );
};
