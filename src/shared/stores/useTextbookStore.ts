// src/stores/useTextbookStore.ts

import { create } from 'zustand';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { getTextbooks } from '@/shared/stores/curd-textbook';

// 💡 1. activeTextbook の型定義
interface ActiveTextbookState {
  id: string | null;
  isFound: boolean;
  data: TextbookDocument | undefined;
}

// 2. 状態（State）の型定義を更新
interface TextbookState {
  textbooks: TextbookDocument[];
  isLoading: boolean;
  error: string | null;
  activeTextbook: ActiveTextbookState;

  // 3. アクション（Actions）の型定義
  fetchTextbooks: () => Promise<void>;
  setTextbooks: (textbooks: TextbookDocument[]) => void;
  // 💡 戻り値の型を変更
  getTextbookById: (id: string) => Promise<ActiveTextbookState>;
}

// 4. Zustandストアの作成
export const useTextbookStore = create<TextbookState>((set, get) => ({
  // 状態の初期値
  textbooks: [],
  isLoading: false,
  error: null,
  // 💡 activeTextbook の初期値
  activeTextbook: {
    id: null,
    isFound: false,
    data: undefined,
  },

  setTextbooks: (textbooks) => set({ textbooks }),

  // 非同期でデータをフェッチするアクション (変更なし)
  fetchTextbooks: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getTextbooks();

      set({
        textbooks: data,
        isLoading: false,
      });
      return;
    } catch (e) {
      console.error('Failed to fetch textbooks:', e);
      set({
        textbooks: [],
        isLoading: false,
        error: '教科書データの取得に失敗しました。',
      });
      throw new Error('データの取得に失敗しました');
    }
  },

  getTextbookById: async (id: string): Promise<ActiveTextbookState> => {
    const state = get();
    let textbook: TextbookDocument | undefined;

    // 1. 現在のストア内のデータから検索
    textbook = state.textbooks.find((doc) => doc.id === id);

    // 2. データが見つからなかった場合、強制的にデータを再フェッチ
    if (!textbook && !state.isLoading) {
      try {
        // 再フェッチを実行し、ストアの textbooks を更新
        await get().fetchTextbooks();

        // 再フェッチ後の新しいストアデータから再検索
        const updatedState = get();
        textbook = updatedState.textbooks.find((doc) => doc.id === id);
      } catch (e) {
        // フェッチエラーの場合、activeTextbook も失敗として更新
        const result: ActiveTextbookState = { id, isFound: false, data: undefined };
        set({ activeTextbook: result });
        return result;
      }
    }

    // 3. activeTextbook を更新
    const found = !!textbook;
    const result: ActiveTextbookState = {
      id,
      isFound: found,
      data: textbook,
    };

    set({ activeTextbook: result });

    // 4. 結果を返す
    return result;
  },
}));
