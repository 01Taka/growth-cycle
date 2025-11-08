import { forwardRef, ReactNode, useMemo, useState } from 'react';
import {
  CheckIcon,
  Combobox,
  ComboboxItem,
  CSSProperties,
  Group,
  TextInput,
  useCombobox,
} from '@mantine/core';

/** 新規作成オプションの特別な識別子 */
const CREATE_NEW_VALUE = 'mantine-create-new-option';

/**
 * カスタムSelectコンポーネントのProps
 * CustomTagsInputPropsから単一値用に変更
 */
export interface CustomSelectProps {
  /** 選択肢データ。ComboboxItem[] または string[] 形式。 */
  data: ComboboxItem[] | string[];
  /** 選択されている値（単一）。 */
  value: string; // string[] から string に変更
  /** エラーメッセージ。 */
  error?: ReactNode;
  /** 値が変更されたときに呼び出されるコールバック。 */
  onChange: (value: string) => void; // (value: string[]) から (value: string) に変更
  /** フォームのラベル。 */
  label?: string;
  /** インプットのプレースホルダー。 */
  placeholder?: string;
  createNewLabel?: string | ((search: string) => string);
  emptyOptionMessage?: string;
  hideSelectedOptions?: boolean;
  /**
   * 外部から注入する検索ロジック。
   * (data, search) => ComboboxItem[] のシグネチャを持つ。
   */
  filterOptions?: (data: ComboboxItem[], search: string) => ComboboxItem[];
  /**
   * 新規作成オプションが選択されたときに呼び出されるコールバック。
   * 親コンポーネントでdataを更新することを期待する。
   */
  onCreate: (query: string) => void;

  createNewOptionStyle?: CSSProperties;
  /** 新規作成機能を無効化するかどうか。 */
  disableCreation?: boolean;
  /** 新規作成が無効化されている場合に表示するメッセージ。 */
  creationDisabledMessage?: string;
  shouldCloseOnOptionSubmit?: boolean;
}

/**
 * 独自の検索・新規作成ロジックを持つクリエータブルなSelectコンポーネント（単一値）。
 */
export const CustomCreatableSelect = forwardRef<HTMLInputElement, CustomSelectProps>(
  (
    {
      data,
      value, // 単一値
      error,
      onChange, // 単一値を返す
      label,
      placeholder,
      createNewOptionStyle,
      emptyOptionMessage = '検索結果がありません',
      hideSelectedOptions, // Selectではあまり意味がないが、互換性のために残す
      filterOptions,
      onCreate,
      createNewLabel = (search) => `+ 新しい "${search}" を作成`,
      disableCreation = false,
      creationDisabledMessage = '新規作成は無効化されています',
      shouldCloseOnOptionSubmit = true, // Selectなので基本的に閉じる
      ...others
    },
    ref
  ) => {
    const [search, setSearch] = useState('');
    // 💡 修正点 1: ドロップダウンの開閉状態をトラックする状態を追加
    const [isDropdownOpened, setIsDropdownOpened] = useState(false);

    // ComboboxのUI状態を管理するフック
    const combobox = useCombobox({
      // 💡 修正点 2: ドロップダウンが開いたら状態を更新し、検索ボックスに現在のラベルをセット
      onDropdownOpen: () => {
        setIsDropdownOpened(true);
        // ドロップダウンが開くときに、現在のラベルを検索ボックスにセット
        setSearch(selectedOptionLabel);
      },
      // 💡 修正点 3: ドロップダウンが閉じたら状態を更新
      onDropdownClose: () => {
        setIsDropdownOpened(false);
        setSearch(''); // ドロップダウンが閉じたら検索状態をリセット
        combobox.resetSelectedOption();
      },
    });

    // dataを { value, label } 形式に正規化
    const normalizedData = useMemo(() => {
      if (data.length > 0 && typeof data[0] === 'string') {
        return (data as string[]).map((item) => ({ value: item, label: item }));
      }
      return data as ComboboxItem[];
    }, [data]);

    // 選択された値のラベル
    const selectedOptionLabel = useMemo(() => {
      return normalizedData.find((item) => item.value === value)?.label ?? value;
    }, [normalizedData, value]);

    // デフォルトのフィルタリングロジック
    const defaultFilter = (data: ComboboxItem[], search: string) => {
      const query = search.toLowerCase().trim();
      if (query.length === 0) {
        return data;
      }
      return data.filter((item) => item.label.toLowerCase().includes(query));
    };

    // フィルタリングされたオプションのリストを計算
    const filtered = useMemo(() => {
      return filterOptions?.(normalizedData, search) ?? defaultFilter(normalizedData, search);
    }, [normalizedData, search, filterOptions]);

    // 既存オプションとの完全一致チェック
    const exactOptionMatch = normalizedData.some(
      (item) => item.label.toLowerCase() === search.toLowerCase()
    );

    /**
     * オプションの確定（選択または作成）ハンドラー
     */
    const handleOptionSubmit = (submittedValue: string) => {
      if (submittedValue === CREATE_NEW_VALUE) {
        if (!disableCreation) {
          // 新規作成が有効な場合のみ実行
          onCreate(search);
        }
      } else {
        // 通常のオプション選択
        onChange(submittedValue); // 単一値をセット
      }

      setSearch(''); // 検索をリセット
      combobox.closeDropdown(); // Selectなのでオプション確定で閉じる
    };

    // ドロップダウンオプションのレンダリング
    let options = filtered
      // Selectの場合、hideSelectedOptionsは基本的に考慮しないか、TagsInputと互換性を持たせるため
      .filter((item) => !hideSelectedOptions || item.value !== value)
      .map((item) => (
        <Combobox.Option
          value={item.value}
          key={item.value}
          active={item.value === value} // 現在の値がアクティブ
          onMouseDown={(event) => event.preventDefault()}
        >
          <Group gap="sm">
            {item.value === value && <CheckIcon size={12} />} {/* 選択された値にチェックマーク */}
            <span>{item.label}</span>
          </Group>
        </Combobox.Option>
      ));

    // 新規作成オプションまたは無効化メッセージの追加
    if (search.trim().length > 0 && !exactOptionMatch) {
      if (!disableCreation) {
        // 新規作成が有効な場合
        const label =
          typeof createNewLabel === 'function' ? createNewLabel(search) : createNewLabel;

        options.push(
          <Combobox.Option
            value={CREATE_NEW_VALUE}
            key={CREATE_NEW_VALUE}
            styles={{
              option: { color: 'teal', ...createNewOptionStyle },
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            {label}
          </Combobox.Option>
        );
      } else {
        // 新規作成が無効な場合
        options.push(
          <Combobox.Option
            value={`disabled-message-${search}`} // 一意な値
            key={`disabled-message-${search}`}
            disabled // 選択不可にする
            styles={{
              option: { fontStyle: 'italic', opacity: 0.6 },
            }}
          >
            {creationDisabledMessage}
          </Combobox.Option>
        );
      }
    }

    // TextInputに表示する値
    // 💡 修正点 4: isDropdownOpenedがtrueの場合は、search（空文字列も含む）をそのまま表示
    const displayValue = isDropdownOpened ? search : selectedOptionLabel;

    return (
      <Combobox
        store={combobox}
        onOptionSubmit={handleOptionSubmit}
        withinPortal={false}
        width={'100%'}
      >
        <Combobox.Target>
          <TextInput
            ref={ref}
            label={label}
            placeholder={placeholder}
            error={error}
            value={displayValue} // 💡 修正後のdisplayValueを使用
            onChange={(event) => {
              combobox.openDropdown();
              setSearch(event.currentTarget.value);
            }}
            onClick={() => {
              // onClickとonFocusは、onDropdownOpenでsearchをセットするようにしたため、openDropdownのみ
              combobox.openDropdown();
            }}
            onFocus={() => {
              // onClickとonFocusは、onDropdownOpenでsearchをセットするようにしたため、openDropdownのみ
              combobox.openDropdown();
            }}
            onBlur={() => {
              // ComboboxのonDropdownCloseでsearchがリセットされる
              combobox.closeDropdown();
            }}
            rightSection={<Combobox.Chevron />} // Selectらしい右側のシェブロン
            readOnly={false} // 編集可能（検索可能）
            {...others}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {options.length > 0 ? options : <Combobox.Empty>{emptyOptionMessage}</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    );
  }
);
