import { css, keyframes } from '@emotion/react'; // Import keyframes and css
import { Box, MantineStyleProp } from '@mantine/core';

// ... (Interface and component definition remains the same)

// Define the scale animation keyframes (from Step 1)
const scaleAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;
interface AuraEffectProps {
  color: string;
  size: number;
  blurRadius: number;
  opacity?: number;
  // styleの型は変更なし
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
      // Use the 'css' prop to apply the keyframe animation
      css={css`
        animation: ${scaleAnimation} 3s ease-in-out infinite; /* Apply animation */
      `}
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
