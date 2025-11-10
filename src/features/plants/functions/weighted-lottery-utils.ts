interface WeightedItem {
  weight?: number; // 重みプロパティはオプション
  [key: string]: any; // その他のプロパティ
}

/**
 * 重み（weight）に基づいてオブジェクト配列から一つの要素を抽選します。
 *
 * @param items 抽選対象のオブジェクトの配列
 * @returns 抽選されたオブジェクト。配列が空の場合は null を返します。
 */
export function weightedRandomSelection<T extends WeightedItem>(items: T[]): T | null {
  if (items.length === 0) {
    return null;
  }

  // 1. 各要素の有効な重みを取得し、累積重みを計算する
  let totalWeight = 0;
  const weightedList = items.map((item) => {
    // weightが有効な正の数値でなければ 0 とする
    const weight = typeof item.weight === 'number' && item.weight > 0 ? item.weight : 0;
    totalWeight += weight;

    return {
      item,
      weight,
      // 累積重みを計算（抽選ルーレットの境界線として利用）
      cumulativeWeight: totalWeight,
    };
  });

  // 2. 合計重みが 0 の場合（全て重みを持たない、または配列が空だった場合）
  if (totalWeight === 0) {
    // 全ての要素が重み0の場合、一律で最初の要素を返す（またはランダムに返すなどの対応も可能）
    // ここでは「重み0のものを抽選しない」という要件を厳密に適用し、nullを返します。
    // もし「重みがない場合は均等に抽選する」としたい場合は、ここで異なるロジックが必要です。
    // 今回は「weightを持たない場合は確率0として扱う」に基づき、nullを返します。
    return null;
  }

  // 3. 0 から totalWeight の間の乱数を生成する
  const randomNumber = Math.random() * totalWeight;

  // 4. 累積重みを使って抽選を行う
  for (const entry of weightedList) {
    // 乱数が現在の累積重み以下の場合は、その要素が選ばれた
    if (randomNumber < entry.cumulativeWeight) {
      return entry.item;
    }
  }

  // 理論上はここに到達しないが、フォールバックとして null を返す
  return null;
}
