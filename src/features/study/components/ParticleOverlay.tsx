import React, { useCallback, useMemo } from 'react';
import type { Container, IOptions, RecursivePartial } from '@tsparticles/engine';
import { Particles } from '@tsparticles/react';
import { Box, BoxProps } from '@mantine/core';

// ディープマージ用のシンプルなユーティリティ（tsParticlesの設定用）
// 外部からのオプションでデフォルト値を上書きできるようにします。
const deepMerge = (target: any, source: any): RecursivePartial<IOptions> => {
  // ターゲットまたはソースがオブジェクトでない、またはnullの場合はソースの値を返す
  if (
    typeof target !== 'object' ||
    target === null ||
    typeof source !== 'object' ||
    source === null
  ) {
    return source === undefined ? target : source;
  }

  const output = Object.assign({}, target);
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      // 配列は置き換え
      if (Array.isArray(sourceValue)) {
        output[key] = sourceValue;
      }
      // オブジェクトの場合は再帰的にマージ
      else if (typeof sourceValue === 'object' && sourceValue !== null) {
        output[key] = deepMerge(targetValue, sourceValue);
      }
      // その他の値は置き換え
      else {
        output[key] = sourceValue;
      }
    }
  }
  return output;
};

// MantineのBoxのプロパティを継承し、tsParticlesのOptionsをオプションで受け取る
interface ParticleOverlayProps extends BoxProps {
  color?: string;
  /** tsParticlesのカスタマイズオプション */
  options?: RecursivePartial<IOptions>;
}

// パーティクルが画面全体を漂うためのデフォルト設定
const defaultOptions: RecursivePartial<IOptions> = {
  // 1. フルスクリーン設定
  fullScreen: {
    enable: true,
    zIndex: 100, // 他のコンテンツの上に表示
  },
  // 2. 背景設定
  background: {
    color: {
      value: 'transparent', // 背景は透過
    },
  },
  // 3. 全体設定
  fpsLimit: 60,
  detectRetina: true,

  // 4. パーティクルの動きと外観
  particles: {
    reduceDuplicates: true,
    number: {
      value: 80, // パーティクルの数
      density: {
        enable: true,
      },
    },
    color: {
      value: '#fff',
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: { min: 0.2, max: 0.6 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 4 }, // サイズに幅を持たせる
    },
    move: {
      enable: true,
      speed: 0.5, // ゆっくりと漂う
      direction: 'none',
      random: true, // ランダムな動き
      straight: false,
      outModes: {
        default: 'out',
      },
    },
  },
};

/**
 * tsParticlesを使用して画面全体にパーティクルをオーバーレイ表示するコンポーネント。
 * options propで外部から設定をカスタマイズできます。
 */
export const ParticleOverlay = React.memo(({ color, options, ...props }: ParticleOverlayProps) => {
  // 外部オプションとデフォルトオプションをマージ
  const mergedOptions = useMemo(() => {
    const data = deepMerge(defaultOptions, options || {});
    if (color && data.particles?.color?.value) {
      data.particles.color.value = color;
    }
    return data;
  }, [options]);

  // パーティクルがロードされた後のコールバック (引数は Container)
  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    if (container) {
      console.log('tsParticles container loaded.');
    }
  }, []);

  return (
    // MantineのBoxコンポーネントを使用
    <Box
      style={{
        pointerEvents: 'none', // パーティクルがマウスクリックをブロックしないようにする
      }}
      {...props}
    >
      {/* tsParticlesのReactコンポーネントを使用 */}
      <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={mergedOptions} />
    </Box>
  );
});
