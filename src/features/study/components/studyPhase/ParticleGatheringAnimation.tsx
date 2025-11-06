import { useCallback, useMemo } from 'react';
import { css } from '@emotion/css';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

// 目的地座標 (画面中央)
const DESTINATION = { x: 50, y: 50 };

const ParticleGatheringAnimation = () => {
  // 1. Mantine/EmotionでコンテナとParticlesコンポーネントのスタイルを定義

  // 粒子のコンテナスタイル (画面いっぱいに広げる)
  const containerStyle = css({
    width: '100%',
    height: '100vh',
    position: 'relative',
    backgroundColor: '#000000', // 粒子を見やすくするために背景を設定
    overflow: 'hidden', // エミッタで画面外から粒子を生成するため
  });

  // 粒子の描画要素 (Canvas) にぼかしを適用するスタイル
  const particlesBlurStyle = css({
    filter: 'blur(0.5px)', // 粒子の周囲がぼやける効果
    width: '100%',
    height: '100%',
  });

  // tsParticlesの初期化関数
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // 2. 粒子の設定 (Options)
  const particleOptions = useMemo(
    () => ({
      fullScreen: { enable: false }, // 親要素に合わせたサイズを使用
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        size: {
          value: { min: 1, max: 3 }, // 初期サイズは小さめ
          animation: { enable: true, speed: 5, minimumValue: 0.1, sync: false },
        },
        opacity: {
          value: 0, // 👈 初期不透明度を0に設定
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1, // フェードイン: 0.1まで上昇
            sync: false,
            startValue: 'min',
          },
        },
        links: { enable: false },
        move: {
          enable: true,
          speed: 1.5, // 移動速度
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'none' }, // 画面外に出ても消えないようにする (Emitterと併用)
        },
      },

      // 3. 画面外から粒子を生成する Emitter
      // emitters: [
      //   {
      //     direction: 'right', // 左側から右へ向かう
      //     position: { x: -5, y: 50 }, // 画面左端の外側から生成
      //     rate: { quantity: 3, delay: 0.1 }, // 連続的に生成
      //     life: { duration: 2, count: 1 }, // エミッタの寿命を短くし、徐々に粒子生成を終える
      //     particles: {
      //       move: { speed: 1.5, direction: 'right', enable: true },
      //     },
      //   },
      //   // 別の方向からも生成したい場合は追加可能 (例: 上から下へ)
      //   {
      //     direction: 'bottom',
      //     position: { x: 50, y: -5 },
      //     rate: { quantity: 1, delay: 0.3 },
      //     life: { duration: 1.5, count: 1 },
      //     particles: {
      //       move: { speed: 1, direction: 'bottom', enable: true },
      //     },
      //   },
      // ] as const,

      // 4. 目的地への集合 (onDiv attract) と サイズ/フェードアウト (onDiv bubble)
      interactivity: {
        events: {
          onDiv: [
            // 集合アニメーション
            {
              enable: true,
              type: 'circle',
              selectors: '#target-area',
              mode: 'attract', // 目的地に向かって粒子を引き寄せる
              distance: 250, // 広い吸引範囲
            },
            // サイズアップとフェードアウト
            {
              enable: true,
              type: 'circle',
              selectors: '#target-area',
              mode: 'bubble', // 範囲内の粒子にサイズ変更と不透明度変更を適用
              distance: 100, // ターゲットエリアに近づいた時
            },
          ] as const,
        },
        modes: {
          attract: {
            distance: 250,
            duration: 0.5,
            factor: 3, // 吸引の強さ
          },
          bubble: {
            distance: 100,
            size: 15, // 目的地に近づいた時の最大サイズ
            opacity: 0, // 目的地に近づくと完全にフェードアウト
            duration: 0.5,
          },
        },
      },
    }),
    []
  );

  return (
    <div className={containerStyle}>
      {/* 目的地となるエリア (インタラクティブモードのターゲット) */}
      <div
        id="target-area"
        style={{
          position: 'absolute',
          top: `${DESTINATION.y}%`,
          left: `${DESTINATION.x}%`,
          width: '10px', // ターゲット自体は小さくても良い
          height: '10px',
          transform: 'translate(-50%, -50%)',
          // デバッグ用に背景色を一時的に設定可能
          // backgroundColor: 'red',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default ParticleGatheringAnimation;
