import { Subject } from '@/shared/types/study-shared-types';
import { TextbookItemProps } from '../components/shared-props-types';

/**
 * 前の位置と異なる新しいランダムな位置を継続的に生成するイテレーターです。
 * @param divisions 分割数（例: 200）。生成される値の精度を決定します。
 * @param maxAttempts 最大試行回数。この回数内に異なる値が取得できない場合はイテレーターを終了します。
 * @yields 以前の位置と異なる新しい位置。
 */
function* newPositionGenerator(divisions = 200, maxAttempts = 10) {
  let previousPositionX = undefined; // 最初の位置は undefined

  // 無限ループで、next()が呼ばれるたびに新しい値を生成し続ける
  while (true) {
    let newPositionX;
    let attempts = 0;

    // 最大試行回数まで for ループで試行
    for (; attempts < maxAttempts; attempts++) {
      // 新しい位置を生成
      newPositionX = Math.floor(Math.random() * divisions) / divisions;

      // 前回の位置と異なるかチェック
      if (newPositionX !== previousPositionX) {
        // 異なる値が見つかったら、ループを抜ける
        break;
      }
    }

    // 試行の結果をチェック
    if (attempts === maxAttempts) {
      // maxAttempts回試行しても異なる値を取得できなかった場合
      // -1 を返してジェネレーターを終了
      return -1;
    }

    // 異なる値が得られた場合
    // 1. その値を yield して呼び出し元に返す
    yield newPositionX;

    // 2. 次回のために現在の値を「前回の位置」として保持
    previousPositionX = newPositionX;
  }
}

interface TextbookPlant {
  plantIndex: number;
  positionX: number; // Value from 0 to 1
  size: number;
}

/**
 * TextbookPlantのダミーデータを生成する関数
 * @param count 生成したいデータ数
 * @returns TextbookPlant[]
 */
export const generateDummyTextbookPlants = (
  count: number,
  minSize: number,
  maxSize: number,
  divisions = 200
): TextbookPlant[] => {
  const positionIterator = newPositionGenerator(divisions);

  const dummyPlants: TextbookPlant[] = [];

  for (let i = 0; i < count; i++) {
    // plantIndex: 0 から 16 の間のランダムな整数を生成
    const randomPlantIndex = Math.floor(Math.random() * 17); // 17を含まない

    // positionX: 0.0 から 1.0 の間のランダムな小数を生成
    const randomPositionX = positionIterator.next();

    if (randomPositionX.done || !randomPositionX.value) {
      console.log(`\nイテレーターが終了しました。最終結果: ${randomPositionX.value} (失敗)`);
      break;
    }

    const size = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);

    dummyPlants.push({
      plantIndex: randomPlantIndex,
      positionX: randomPositionX.value,
      size,
    });
  }

  return dummyPlants;
};

export const generateDummyTextbookItemProps = (count: number): TextbookItemProps[] => {
  const subjects: Subject[] = ['math', 'science', 'socialStudies', 'japanese'];
  const dummyData: TextbookItemProps[] = [];

  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const textbookName = `教科書_${subject.toUpperCase()}_${i + 1}`;
    const totalPlants = Math.floor(Math.random() * 40) + 10; // 10から49
    const daysSinceLastAttempt = Math.floor(Math.random() * 30); // 0から29日
    const maxSize = 64; // 仮の値
    const minSize = 32; // 仮の値

    // totalPlantsの数のダミープラントを生成
    const plants = generateDummyTextbookPlants(totalPlants, minSize, maxSize);

    dummyData.push({
      subject,
      textbookName,
      totalPlants: plants.length,
      daysSinceLastAttempt,
      plants,
      maxSize,
    });
  }

  return dummyData;
};
