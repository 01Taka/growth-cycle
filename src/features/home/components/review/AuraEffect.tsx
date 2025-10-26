import { Box, MantineStyleProp } from '@mantine/core';

interface AuraEffectProps {
  color: string;
  size: number;
  blurRadius: number;
  opacity?: number;
  style?: MantineStyleProp;
}

export const AuraEffect: React.FC<AuraEffectProps> = ({
  color,
  size,
  blurRadius,
  opacity = 0.5,
  style,
}) => {
  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 ${blurRadius}px ${color}`,
        filter: `blur(${blurRadius / 2}px)`,
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};
