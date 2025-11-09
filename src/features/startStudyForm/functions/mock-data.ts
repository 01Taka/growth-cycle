// import { Textbook } from '@/shared/data/documents/textbook-types';

// // ------------------------------------------------------------
// // 1. テキストブックマスタデータ (Textbook IDに紐づく教科と名前)
// // ------------------------------------------------------------

// /**
//  * MOCK_TEXTBOOK_DATA
//  * Textbook IDをキーとして、その教科書に固有の冗長情報（教科、名前）を保持します。
//  */
// export const MOCK_TEXTBOOK_DATA: Record<string, Textbook> = {
//   'math-textbook-001': {
//     subject: 'math', // 小文字に修正
//     name: '高校数学A 基礎編',
//   },
//   'eng-textbook-002': {
//     subject: 'english', // 小文字に修正
//     name: '大学受験 英文法マスター',
//   },
// };

// // ------------------------------------------------------------
// // 2. ユニットマスタデータ (単一ドキュメント /master_data/units を模倣)
// //    subjectNameを削除し、subjectIdのみを使用します。
// // ------------------------------------------------------------

// /**
//  * MOCK_UNIT_MASTER_DOCUMENT
//  * Firestoreの /master_data/units ドキュメント全体を模倣。
//  */
// export const MOCK_UNIT_MASTER_DOCUMENT = {
//   units: [
//     // 数学のユニット
//     { id: 'u1-math', name: '集合と論理', subjectId: 'math' },
//     { id: 'u2-math', name: '二次関数', subjectId: 'math' },
//     // 英語のユニット
//     { id: 'u3-eng', name: '時制', subjectId: 'english' },
//     { id: 'u4-eng', name: '仮定法', subjectId: 'english' },
//   ],
// };

// // ------------------------------------------------------------
// // 3. カテゴリーマスタデータ (単一ドキュメント /master_data/categories を模倣)
// //    subjectNameを削除し、subjectIdのみを使用します。
// // ------------------------------------------------------------

// /**
//  * MOCK_CATEGORY_MASTER_DOCUMENT
//  * Firestoreの /master_data/categories ドキュメント全体を模倣。
//  */
// export const MOCK_CATEGORY_MASTER_DOCUMENT = {
//   categories: [
//     // 共通カテゴリー
//     { id: 'c1-basic', name: '基礎問題' },
//     { id: 'c2-app', name: '応用問題' },
//     // 英語のカテゴリー
//     { id: 'c3-grammar', name: '文法' },
//     { id: 'c4-vocab', name: '語彙' },
//   ],
// };| DEL |
