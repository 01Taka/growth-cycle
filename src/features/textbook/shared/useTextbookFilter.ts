import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { Subject } from '@/shared/types/subject-types';

// TextbookMain.tsx から移動した定数
const REDISPLAY_TIME = 200;
const VALID_SUBJECTS: Subject[] = ['japanese', 'math', 'english', 'science', 'socialStudies'];

// フックが返す値の型定義
interface UseTextbookFilterReturn {
  selectedSubject: Subject | null;
  filterData: TextbookDocument[];
  displayPlant: boolean;
  handleSubjectClick: (subject: Subject | null) => void;
}

/**
 * 教科書のフィルタリング、URLパラメータの処理、アニメーション制御をカプセル化するカスタムフック。
 * * @param textbooks 全ての教科書データ（実際はAPIから取得するデータ）
 * @returns フィルタリングされたデータ、選択された科目、アニメーション状態、クリックハンドラ
 */
export const useTextbookFilter = (textbooks: TextbookDocument[]): UseTextbookFilterReturn => {
  const [searchParams] = useSearchParams();

  // URLパラメータからの初期値設定
  const urlSubject = searchParams.get('subject') as Subject | null;
  const initialSubject: Subject | null = VALID_SUBJECTS.includes(urlSubject as Subject)
    ? (urlSubject as Subject)
    : null;

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(initialSubject);
  const [displayPlant, setDisplayPlant] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // フィルタリング処理
  const filterData = useMemo(
    () => textbooks.filter((data) => !selectedSubject || selectedSubject === data.subject),
    [selectedSubject, textbooks]
  );

  // 科目クリック時の処理 (アニメーション制御を含む)
  const handleSubjectClick = useCallback((subject: Subject | null) => {
    // 既に実行中のタイマーがあればクリア
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setSelectedSubject((prev) => {
      const nextSubject = prev === subject ? null : subject;

      // Subjectが実際に変更される場合のみアニメーション処理を実行
      if (prev !== nextSubject) {
        setDisplayPlant(false); // 即時非表示

        // 遅延表示タイマーを設定
        const newTimerId = setTimeout(() => {
          setDisplayPlant(true);
          timerRef.current = null;
        }, REDISPLAY_TIME);
        timerRef.current = newTimerId;
      }

      return nextSubject;
    });
  }, []);

  // コンポーネントがアンマウントされる際にタイマーを確実にクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    selectedSubject,
    filterData,
    displayPlant,
    handleSubjectClick,
  };
};
