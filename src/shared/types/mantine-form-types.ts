/**
 * Mantineのform.getInputPropsが返す、型安全なProps
 * TValue はフォームフィールドの値の型を指します (例: string, number, boolean)
 */
export type FormInputProps<TValue> = {
  // 値が変更されたときに呼び出される関数
  onChange: (value: TValue) => void;
  // 現在の値 (TextInput, NumberInputなどの標準的な入力用)
  value: TValue;
  // 初期値 (ReactのコントロールされたコンポーネントのPropsとしては通常は不要だが、型定義として残す)
  defaultValue?: TValue;
  // チェック状態 (Checkbox, Radioなどの入力用)
  checked: TValue extends boolean ? boolean : undefined;
  // 初期チェック状態 (ReactのコントロールされたコンポーネントのPropsとしては通常は不要だが、型定義として残す)
  defaultChecked?: TValue extends boolean ? boolean : undefined;
  // エラーメッセージ
  error?: React.ReactNode;
  // フォーカス時
  onFocus?: React.FocusEventHandler<any>;
  // フォーカスが外れた時
  onBlur?: React.FocusEventHandler<any>;
};
