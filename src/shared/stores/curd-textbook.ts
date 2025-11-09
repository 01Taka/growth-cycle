import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { generateIdbCollectionPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';

export const getTextbooks = async () => {
  const textbookPath = generateIdbCollectionPath(IDB_PATH.textbooks, '');

  const textbooks = await idbStore.getCollection<TextbookDocument>(textbookPath);
  return textbooks;
};
