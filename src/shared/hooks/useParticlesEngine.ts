import { useEffect, useState } from 'react';
import { loadAll } from '@tsparticles/all';

/**
 * tsParticlesエンジンをアプリケーション全体で一度だけ初期化するためのカスタムフック。
 * * @returns {{ isInitialized: boolean, error: Error | null }}
 * 初期化状態と発生したエラーを返します。
 */
export const useParticlesEngine = () => {
  // アプリケーション全体で初期化が完了したかどうかを追跡するグローバルフラグ
  // これにより、フックを複数のコンポーネントで使用しても、ロード処理は一度きりになります。
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // コンポーネントがマウントされたときに一度だけ実行
  useEffect(() => {
    // 既に初期化済みであれば何もしない
    if (isInitialized) {
      return;
    }

    // 非同期でエンジンをロードし、初期化を実行
    const initializeParticles = async () => {
      try {
        // tsParticlesのメインエントリポイントを動的にインポート
        const module = await import('@tsparticles/engine');

        if (module.tsParticles) {
          // loadAllを呼び出し、全ての標準機能を登録
          await loadAll(module.tsParticles);
        } else {
          // tsParticlesオブジェクトがない場合のカスタムエラー
          throw new Error('tsParticles object not found in the imported module.');
        }

        // 初期化成功
        setIsInitialized(true);
      } catch (e: any) {
        // エラーハンドリング
        console.error('tsParticles initialization failed:', e);
        setError(
          e instanceof Error
            ? e
            : new Error('An unknown error occurred during particles initialization.')
        );
      }
    };

    initializeParticles();

    // このフックがアンマウントされたときのクリーンアップは不要
    // (エンジン登録はグローバルな処理のため)
  }, [isInitialized]); // isInitializedがtrueになったら再実行しないように依存配列に含める

  return { isInitialized, error };
};
