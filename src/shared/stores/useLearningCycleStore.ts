import { create } from 'zustand';
// 💡 学習サイクルデータの型を仮定
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { getLearningCycles } from './curd-learning-cycle';

// 💡 学習サイクルデータを取得する非同期関数を仮定

// 1. 💡 activeLearningCycle の型定義 (TextbookStoreと同一構造)
interface ActiveLearningCycleState {
  id: string | null;
  isFound: boolean;
  data: LearningCycleDocument | undefined;
}

// 2. 💡 状態（State）の型定義
interface LearningCycleState {
  learningCycles: LearningCycleDocument[];
  isLoading: boolean;
  error: string | null;
  activeLearningCycle: ActiveLearningCycleState; // 💡 アクティブな学習サイクル

  // 3. 💡 アクション（Actions）の型定義
  fetchLearningCycles: () => Promise<void>;
  setLearningCycles: (cycles: LearningCycleDocument[]) => void;
  getLearningCycleById: (id: string) => Promise<ActiveLearningCycleState>;
}

// 4. Zustandストアの作成
export const useLearningCycleStore = create<LearningCycleState>((set, get) => ({
  // 状態の初期値
  learningCycles: [],
  isLoading: false,
  error: null,
  // 💡 activeLearningCycle の初期値
  activeLearningCycle: {
    id: null,
    isFound: false,
    data: undefined,
  },

  // データの直接設定アクション
  setLearningCycles: (cycles) => set({ learningCycles: cycles }),

  // 非同期でデータをフェッチするアクション
  fetchLearningCycles: async () => {
    set({ isLoading: true, error: null });

    try {
      // 💡 学習サイクルデータを取得
      const data = await getLearningCycles();

      set({
        learningCycles: data,
        isLoading: false,
      });
      return;
    } catch (e) {
      console.error('Failed to fetch learning cycles:', e);
      set({
        learningCycles: [],
        isLoading: false,
        error: '学習サイクルデータの取得に失敗しました。',
      });
      throw new Error('データの取得に失敗しました');
    }
  },

  // IDを受け取り、アクティブな学習サイクルを更新するアクション
  getLearningCycleById: async (id: string): Promise<ActiveLearningCycleState> => {
    const state = get();
    let cycle: LearningCycleDocument | undefined;

    // 1. 現在のストア内のデータから検索
    cycle = state.learningCycles.find((doc) => doc.id === id);

    // 2. データが見つからなかった場合、強制的にデータを再フェッチ
    if (!cycle && !state.isLoading) {
      try {
        await get().fetchLearningCycles(); // 再フェッチを実行

        // 再フェッチ後の新しいストアデータから再検索
        const updatedState = get();
        cycle = updatedState.learningCycles.find((doc) => doc.id === id);
      } catch (e) {
        // フェッチエラーの場合、失敗として更新
        const result: ActiveLearningCycleState = { id, isFound: false, data: undefined };
        set({ activeLearningCycle: result });
        return result;
      }
    }

    // 3. activeLearningCycle を更新
    const found = !!cycle;
    const result: ActiveLearningCycleState = {
      id,
      isFound: found,
      data: cycle,
    };

    set({ activeLearningCycle: result });

    // 4. 結果を返す
    return result;
  },
}));
