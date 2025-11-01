import React, { useCallback, useState } from 'react'; // useCallback をインポート
import { Button, Container, Text } from '@mantine/core';
import { CustomCreatableTagsInput } from '@/shared/components/CustomCreatableTagsInput';

// 利用可能な初期データ（通常はDBなどからフェッチされる）
const initialAvailableTags = [
  { value: 'react', label: 'React' },
  { value: 'mantine', label: 'Mantine' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'frontend', label: 'Frontend' },
];

// データ型を定義 (可読性向上のため)
type TagOption = { value: string; label: string };

function TagsInputExample() {
  // 1. 選択されたタグの状態
  const [selectedTags, setSelectedTags] = useState<string[]>(['react', 'mantine']);

  // 2. 利用可能な全オプションの状態
  const [availableTags, setAvailableTags] = useState<TagOption[]>(initialAvailableTags);

  // --- メモ化されたハンドラー ---

  // 3. 値の変更ハンドラー (setSelectedTagsはReactのステート更新関数なのでメモ化の依存関係不要)
  const handleChangeTags = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []); // 依存配列は空

  /**
   * 🏷️ 新規タグ作成ハンドラー
   * onCreateが呼ばれたら、新しいタグを availableTags に追加します。
   * @param newTagLabel 作成する新しいタグのラベル
   */
  const handleCreateNewTag = useCallback(
    (newTagLabel: string) => {
      // 慣例として、value は小文字のスネークケースなど、一意な識別子にする
      const newTagValue = newTagLabel.toLowerCase().replace(/\s+/g, '-');

      // availableTags の最新値を取得するために、setStateの関数形式を使用するか、依存配列に availableTags を含める
      // ここでは availableTags を依存配列に含めるシンプルな方法を採用
      if (!availableTags.some((tag) => tag.label === newTagValue)) {
        const newTagOption: TagOption = { value: newTagValue, label: newTagLabel };

        // 利用可能なオプションリストを更新 (関数形式で最新の状態を安全に取得)
        setAvailableTags((current) =>
          current.some((value) => value.label === newTagOption.label)
            ? current
            : [...current, newTagOption]
        );

        // 新しく作成したタグを即座に選択状態に追加
        setSelectedTags((current) =>
          current.includes(newTagLabel) ? current : [...current, newTagValue]
        );
      }
    },
    [availableTags]
  ); // availableTags が変更された場合にのみ関数を再生成する

  /**
   * 🔎 カスタムフィルターの例
   * ラベルだけでなく、バリューでも検索したい場合などに使います。
   */
  const customFilter = useCallback((data: TagOption[], search: string) => {
    const query = search.toLowerCase().trim();
    if (query.length === 0) {
      return data;
    }

    // label または value にクエリが含まれるものをフィルタ
    return data.filter(
      (item) => item.label.toLowerCase().includes(query) || item.value.toLowerCase().includes(query)
    );
  }, []); // 依存配列は空

  // 「全てクリア」ボタンのハンドラー
  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
  }, []); // 依存配列は空

  // ---

  return (
    <Container size="sm" py="xl" w={'100%'}>
      {/* CustomCreatableTagsInput に渡す関数プロパティをメモ化 */}
      <CustomCreatableTagsInput
        label="スキルタグの選択・作成"
        placeholder="タグを入力または選択してください"
        // 1. 利用可能なデータ
        data={availableTags}
        // 2. 現在選択されている値
        value={selectedTags}
        // 3. 値の変更ハンドラー (メモ化)
        onChange={handleChangeTags}
        // 4. 新規作成ハンドラー (メモ化)
        onCreate={handleCreateNewTag}
        // 5. (オプション) カスタム検索ロジック (メモ化)
        filterOptions={customFilter}
        // エラー表示の例
        error={selectedTags.length === 0 ? '' : undefined}
        hideSelectedOptions
      />

      <Text mt="lg">
        現在選択されているタグ:
        <Text span fw={500} ml="xs">
          {selectedTags.join(', ')}
        </Text>
      </Text>

      {/* onClick ハンドラーもメモ化 */}
      <Button onClick={handleClearTags} mt="md" variant="light">
        全てクリア
      </Button>
    </Container>
  );
}

export default TagsInputExample;
