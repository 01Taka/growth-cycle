// path-configs.ts

export const FirestorePaths = {
  // --- コレクションパス ---
  USERS_COLLECTION: 'users',
  TEXTBOOKS_COLLECTION: 'textbooks', // root or master collection
  LEARNING_CYCLES_COLLECTION: (userId: string) => `users/${userId}/learningCycles`,

  // --- マスターデータドキュメントパス (ユーザーサブコレクション内) ---
  // マスターデータもユーザーサブコレクション内に持たせる設計をシミュレート
  USER_MASTER_UNITS_DOC: (userId: string) => `users/${userId}/master_data/units`,
  USER_MASTER_CATEGORIES_DOC: (userId: string) => `users/${userId}/master_data/categories`,

  // --- その他のドキュメントパス ---
  TEXTBOOK_DOC: (textbookId: string) => `textbooks/${textbookId}`, // root collection
};
