import { create } from 'zustand';
import { readOrCreateLocalUser } from '@/features/app/curd-user';
import { User } from '../data/documents/user/user-document';

// ----------------------------------------------------------------------
// 1. 型定義
// ----------------------------------------------------------------------

// ストアの状態 (State) の型
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// ストアのアクション (Actions / 関数) の型
interface UserActions {
  fetchUser: () => Promise<void>;
  resetUser: () => void;
}

// ストア全体の型 (State + Actions)
type UserStore = UserState & UserActions;

// ----------------------------------------------------------------------
// 2. ストアの実装
// ----------------------------------------------------------------------

// StateCreator<UserStore> を使用して、set関数の型をZustandに伝えます
export const useUserStore = create<UserStore>((set) => ({
  // 1. ユーザーデータ (初期値)
  user: null,

  // 2. ロード中かどうか (初期値)
  isLoading: false,

  // 3. エラー (初期値)
  error: null,

  // 4. 再読み込み（データ取得）関数
  fetchUser: async () => {
    // データ取得開始: ロード中を true、エラーを null に設定
    set({ isLoading: true, error: null });

    try {
      const user: User = await readOrCreateLocalUser();

      // データ取得成功: user を更新、isLoading を false に設定
      set({
        user,
        isLoading: false,
      });
    } catch (err) {
      // データ取得失敗: エラーを設定、isLoading を false に設定
      console.error('Failed to fetch user data:', err);

      // エラーオブジェクトを安全に文字列に変換
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data.';

      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // 補足: user をリセットする関数
  resetUser: () => set({ user: null, isLoading: false, error: null }),
}));

export default useUserStore;
