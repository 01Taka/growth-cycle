import { LOCAL_USER_ID } from '@/shared/constants/app-constants';
import { User, UserDocument } from '@/shared/data/documents/user/user-document';
import { generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { calculateMaxXP } from '../xp/functions/calculate-max-xp';

const LOCAL_USER_PATH = generateIdbPath(IDB_PATH.users, LOCAL_USER_ID);

export const createLocalUser = async (initialUser?: Partial<User>) => {
  const user: User = {
    totalGainedXp: 0,
    ...initialUser,
  };
  return await idbStore.add(LOCAL_USER_PATH, user);
};

export const readOrCreateLocalUser = async (): Promise<UserDocument> => {
  const user = await idbStore.get<UserDocument>(LOCAL_USER_PATH);
  if (!user) {
    await createLocalUser();
    const user = await idbStore.get<UserDocument>(LOCAL_USER_PATH);
    if (!user) {
      throw new Error('ユーザーの作成に失敗しました。');
    }
    return user;
  }
  return user;
};

export const incrementLocalUserXp = async (gainedXp: number) => {
  if (gainedXp < 0 || gainedXp > calculateMaxXP()) {
    throw new Error('不正なXPです');
  }
  const user = await readOrCreateLocalUser();

  const newUser: Partial<User> = {
    totalGainedXp: user.totalGainedXp + gainedXp,
  };
  return idbStore.update(LOCAL_USER_PATH, newUser);
};
