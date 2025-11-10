import { useEffect, useMemo, useState } from 'react';
import { BlockerFunction, To, useBlocker } from 'react-router-dom';

/**
 * useNavigationBlockerフックの引数
 * @property shouldNavigationBlock - React Routerの遷移をブロックするかどうか
 * @property shouldUnloadBlock - ブラウザのタブ閉じ/リロードをブロックするかどうか
 * @property allowedUrls - ブロックせずに遷移を許可するパス名の配列
 * @property onBlock - ナビゲーションがブロックされたときに呼び出されるコールバック
 */
export interface UseNavigationBlockerProps {
  shouldNavigationBlock?: boolean;
  shouldUnloadBlock?: boolean;
  allowedUrls?: string[]; // オプショナル
  onBlock?: (nextLocation: To) => void; // ブロック時のコールバック
}

/**
 * useNavigationBlockerフックの戻り値
 * @property isBlocking - 現在ナビゲーションがブロックされているかどうか
 * @property nextLocation - ブロックされたナビゲーションの移動先 (To | null)
 * @property confirmNavigation - ブロックを解除してナビゲーションを続行する関数
 * @property cancelNavigation - ブロックを解除してナビゲーションをキャンセルする関数
 */
export interface NavigationBlockerState {
  isBlocking: boolean;
  nextLocation: To | null;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

/**
 * React Routerのナビゲーションをブロックし、カスタムモーダルで確認するフック。
 * また、ブラウザのタブ閉じ/リロード (beforeunload) も制御します。
 *
 * @param props - ブロック条件とコールバックを含むプロパティ
 * @returns ナビゲーションブロックの状態と操作関数
 */
export const useNavigationBlocker = ({
  shouldNavigationBlock,
  shouldUnloadBlock,
  allowedUrls = [], // デフォルト値を空配列に設定
  onBlock,
}: UseNavigationBlockerProps): NavigationBlockerState => {
  const [nextLocation, setNextLocation] = useState<To | null>(null);

  // 1️React Router ブロック条件の計算
  const shouldBlockCondition: boolean | BlockerFunction = useMemo(() => {
    // B. ナビゲーションブロックフラグが true の場合は、BlockerFunction を返す
    return ({ nextLocation, currentLocation }) => {
      // A. ナビゲーションブロックフラグが false の場合は、常にブロックしない
      if (!shouldNavigationBlock) {
        onBlock?.(nextLocation);
        return false;
      }

      const nextPathname = nextLocation.pathname;
      const currentPathname = currentLocation.pathname;

      // I. 許可されたURLリストに次のパスが含まれているかチェック
      const isAllowedByList = allowedUrls.some((url) => url === nextPathname);

      // II. 許可リストが空の場合、現在のパスと同じなら許可
      const isSamePath = nextPathname === currentPathname;

      // 許可条件:
      if (isAllowedByList || (allowedUrls.length === 0 && isSamePath)) {
        return false; // ブロックしない
      }

      // ブロック実行: コールバックを実行し、ブロックする
      onBlock?.(nextLocation);
      return true; // ブロックする
    };
  }, [shouldNavigationBlock, allowedUrls, onBlock]);

  // useBlocker に shouldBlockCondition 関数を渡す
  const blocker = useBlocker(shouldBlockCondition);

  // 2️ beforeunload (タブ閉じ/リロード) のロジック
  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      if (shouldUnloadBlock) {
        // 標準的なブロック処理
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    if (shouldUnloadBlock) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [shouldUnloadBlock]);

  // モーダル表示に必要な状態と操作の管理

  // ブロックされた瞬間、移動先 (nextLocation) を保持する
  if (blocker.state === 'blocked' && !nextLocation) {
    // blocker.location は To 型なので直接セット
    setNextLocation(blocker.location);
  }

  // ブロックを解除してナビゲーションを続行
  const confirmNavigation = () => {
    setNextLocation(null);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  // ブロックを解除してナビゲーションをキャンセル (元のページに留まる)
  const cancelNavigation = () => {
    setNextLocation(null);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  return {
    isBlocking: blocker.state === 'blocked',
    nextLocation,
    confirmNavigation,
    cancelNavigation,
  };
};
