import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { CreateTextbookForm } from '../shared/form/create-textbook-form-types';
import { handleCreateTextbook } from '../shared/form/crud-textbook';
import { CreateTextFormCard } from './CreateTextFormCard';

interface TextbookFormMainProps {}

export const TextbookFormMain: React.FC<TextbookFormMainProps> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSubject = searchParams.get('subject') as Subject | null;

  // 1. ローディングとエラー状態の管理を追加
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialSubject: Subject = (
    urlSubject && ['japanese', 'math', 'english', 'science', 'socialStudies'].includes(urlSubject)
      ? urlSubject
      : 'japanese'
  ) as Subject;

  const form = useForm<CreateTextbookForm>({
    initialValues: {
      subject: initialSubject,
      name: '',
      units: [{ id: 'initial', text: '' }],
      categories: [{ id: 'initial', text: '' }],
    },
  });

  const subjects: { value: Subject; label: string }[] = [
    { value: 'japanese', label: '国語' },
    { value: 'math', label: '数学' },
    { value: 'english', label: '英語' },
    { value: 'science', label: '理科' },
    { value: 'socialStudies', label: '社会' },
  ];

  const theme = useSubjectColorMap(form.values.subject);

  const unitNames = useMemo(
    () => form.values.units.map((unit) => unit.text).filter((name) => !!name),
    [form.values.units]
  );

  // 強化されたonSubmit関数
  const onSubmit = async () => {
    // 決定中の状態を開始
    setIsSubmitting(true);
    setErrorMessage(null); // エラーメッセージをリセット

    try {
      const result = await handleCreateTextbook(form.values);

      if (result.success) {
        // 成功: 適切なページへ遷移
        // トースト通知などをここに挿入
        navigate(`/textbooks?subject=${result.data.subject}`);
      } else {
        // 失敗: エラーメッセージを設定
        console.error('Textbook creation failed:', result.error);
        setErrorMessage(result.message || '教科書の作成に失敗しました。'); // エラー通知などをここに挿入
      }
    } catch (e) {
      setErrorMessage('予期せぬエラーが発生しました。');
      console.error('Unexpected error during submission:', e);
    } finally {
      // 処理終了: ローディング状態を解除
      setIsSubmitting(false);
    }
  };

  const isFilled = !!form.values.name;

  return (
    <CreateTextFormCard
      form={form}
      unitNames={unitNames}
      subjects={subjects}
      theme={theme}
      isFilled={isFilled && !isSubmitting}
      onSubmit={form.onSubmit(onSubmit)}
      // isSubmittingをCardコンポーネントに渡して、ボタンのローディング表示に使用
      // エラーメッセージの表示 (Cardコンポーネント内で表示される想定)
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
    />
  );
};
