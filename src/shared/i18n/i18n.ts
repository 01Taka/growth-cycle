import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { subjectResources } from './subject';

// 翻訳リソースの定義
const resources = {
  // 英語 (en) の翻訳辞書
  en: {
    translation: {
      welcome_message: 'Welcome to React.',
      count_message: 'You have {{count}} unread messages.',
      link_text: 'Click here to view details.',
    },
    ...subjectResources.en,
  },
  // 日本語 (ja) の翻訳辞書
  ja: {
    translation: {
      welcome_message: 'Reactへようこそ。',
      count_message: '未読メッセージが{{count}}件あります。',
      link_text: '詳細はこちらをクリック。',
    },
    ...subjectResources.ja,
  },
};

i18n
  .use(initReactI18next) // i18nインスタンスをreact-i18nextと連携
  .init({
    resources, // 翻訳リソース
    ns: ['translation', 'subjects'], // 使用するネームスペースを指定
    defaultNS: 'translation', // デフォルトで使用するネームスペース
    lng: 'ja', // デフォルト言語の設定
    fallbackLng: 'en', // 翻訳キーが見つからなかった場合の代替言語
    interpolation: {
      escapeValue: false, // ReactはXSS対策を既に行っているため
    },
  });

export default i18n;
