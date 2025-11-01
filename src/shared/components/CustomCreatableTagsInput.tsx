import { forwardRef, ReactNode, useMemo, useState } from 'react';
import {
  CheckIcon,
  Combobox,
  ComboboxItem,
  CSSProperties,
  Group,
  Input,
  Pill,
  TextInput,
  useCombobox,
} from '@mantine/core';

/** 新規作成オプションの特別な識別子 */
const CREATE_NEW_VALUE = 'mantine-create-new-option';

/**
 * カスタムTagsInputコンポーネントのProps
 */
interface CustomTagsInputProps {
  /** 選択肢データ。ComboboxItem[] または string[] 形式。 */
  data: ComboboxItem[] | string[];
  /** 選択されている値（タグ）の配列。 */
  value: string[];
  /** エラーメッセージ。 */
  error?: ReactNode;
  /** 値が変更されたときに呼び出されるコールバック。 */
  onChange: (value: string[]) => void;
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
}

/**
 * 独自の検索・新規作成ロジックを持つクリエータブルなTagsInputコンポーネント。
 */
export const CustomCreatableTagsInput = forwardRef<HTMLInputElement, CustomTagsInputProps>(
  (
    {
      data,
      value,
      error,
      onChange,
      label,
      placeholder,
      createNewOptionStyle,
      emptyOptionMessage = '検索結果がありません',
      hideSelectedOptions,
      filterOptions,
      onCreate,
      createNewLabel = (search) => `+ 新しい "${search}" を作成`,
      disableCreation = false,
      creationDisabledMessage = '新規作成は無効化されています',
      ...others
    },
    ref
  ) => {
    const [search, setSearch] = useState('');

    // ComboboxのUI状態を管理するフック
    const combobox = useCombobox({
      onDropdownClose: () => {
        setSearch('');
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
     * 選択されているタグを削除するハンドラー
     */
    const handleValueRemove = (itemValue: string) => {
      onChange(value.filter((v) => v !== itemValue));
    };

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
        const newValue = value.includes(submittedValue)
          ? value.filter((v) => v !== submittedValue) // 解除
          : [...value, submittedValue]; // 選択

        onChange(newValue);
      }

      setSearch('');
    };

    // ドロップダウンオプションのレンダリング
    let options = filtered
      .filter((item) => !hideSelectedOptions || !value.includes(item.value))
      .map((item) => (
        <Combobox.Option
          value={item.value}
          key={item.value}
          active={value.includes(item.value)}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Group gap="sm">
            {value.includes(item.value) && <CheckIcon size={12} />}
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

    // 選択済みのタグ（Pill）の表示
    const tags = value.map((itemValue) => (
      <Pill key={itemValue} withRemoveButton onRemove={() => handleValueRemove(itemValue)}>
        {normalizedData.find((d) => d.value === itemValue)?.label || itemValue}
      </Pill>
    ));

    return (
      <Combobox
        store={combobox}
        onOptionSubmit={handleOptionSubmit}
        withinPortal={false}
        width={'100%'}
      >
        <Combobox.Target>
          <Input.Wrapper w={'100%'} label={label} error={error} {...others}>
            <Group gap="sm" wrap="wrap" w={'100%'}>
              {tags}
              <Combobox.EventsTarget>
                <TextInput
                  ref={ref}
                  value={search}
                  onBlur={() => combobox.closeDropdown()}
                  onFocus={() => combobox.openDropdown()}
                  onChange={(event) => {
                    combobox.openDropdown();
                    setSearch(event.currentTarget.value);
                  }}
                  placeholder={placeholder}
                  style={{ minWidth: 70, flexGrow: 1 }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Group>
          </Input.Wrapper>
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
