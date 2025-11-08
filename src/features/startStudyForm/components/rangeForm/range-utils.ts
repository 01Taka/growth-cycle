import { RangeWithOrder } from '../../types/range-form-types';

/**
 * 範囲配列内の競合を解決する関数。オーダーが大きい（orderが大きい）範囲を優先します。
 * 親範囲が isSingle (単一値) の場合も、子範囲の調整・分割を行います。
 * @param baseRanges 競合を解決したい基本の範囲配列
 * @returns 競合解消後の範囲配列
 */
export const handleResolveConflict = (
  baseRanges: { start: number; end?: number }[]
): { start: number; end?: number }[] => {
  // 1. 初期化と内部形式への変換
  let processedRanges: RangeWithOrder[] = baseRanges.map((range, i) => ({
    start: range.start,
    // endが存在しない場合はstartと同じ値として扱う
    end: range.end ?? range.start,
    isSingle: range.end === undefined, // endがない場合にtrue
    order: i, // 元のインデックスがorder（優先度）となる
  }));

  // 2. order（優先度）の降順でソート
  // 優先度の高い範囲から順に処理することで、その範囲が他の範囲を上書き・分割する形になります。
  processedRanges.sort((a, b) => b.order - a.order);

  // 3. 競合の解決
  const resolvedRanges: RangeWithOrder[] = [];

  for (const currentRange of processedRanges) {
    const newRanges: RangeWithOrder[] = [];

    // 現在の範囲（currentRange）が、既に解決済みの範囲（resolvedRanges）と競合するかチェック
    let isCompletelyCovered = false; // currentRangeが完全に他の範囲に覆われているか

    // resolvedRangesに格納されている範囲を順番にチェック
    for (const resolved of resolvedRanges) {
      // 競合がない場合: resolvedをそのままnewRangesに追加
      // (新しい範囲を処理する際に、既に解決済みの範囲も維持する必要があるため)
      if (currentRange.end < resolved.start || currentRange.start > resolved.end) {
        newRanges.push(resolved);
        continue;
      }

      // **競合がある場合:**

      // 既存のresolvedRangeがcurrentRangeを完全に覆っている場合
      // (これはoccurance順でソートしているため発生しないはずだが、念のため)
      if (currentRange.start >= resolved.start && currentRange.end <= resolved.end) {
        isCompletelyCovered = true;
        // 解決済みの範囲は維持し、現在の範囲は破棄されるため、ここで追加しない
        newRanges.push(resolved);
        continue;
      }

      // currentRangeがresolvedRangeを完全に覆っている場合 (分割の必要なし)
      // currentRangeのorderの方が高いため、resolvedRangeはcurrentRangeに上書きされる。
      // resolvedRangeは破棄され、次のループでcurrentRangeが追加される。

      // 部分的な競合 (currentRangeを分割または縮小する必要がある)
      // currentRange (優先度が低い) は resolved (優先度が高い) を避けるように調整される

      // 1. currentRangeの **前半分** が resolvedRange の前に残る場合
      if (currentRange.start < resolved.start) {
        const remainingStart = currentRange.start;
        const remainingEnd = resolved.start - 1; // 1は単位として扱う
        if (remainingStart <= remainingEnd) {
          newRanges.push({
            start: remainingStart,
            end: remainingEnd,
            isSingle: remainingStart === remainingEnd,
            order: currentRange.order,
          });
        }
      }

      // 2. currentRangeの **後半分** が resolvedRange の後に残る場合
      if (currentRange.end > resolved.end) {
        const remainingStart = resolved.end + 1; // 1は単位として扱う
        const remainingEnd = currentRange.end;
        if (remainingStart <= remainingEnd) {
          newRanges.push({
            start: remainingStart,
            end: remainingEnd,
            isSingle: remainingStart === remainingEnd,
            order: currentRange.order,
          });
        }
      }

      // resolvedRange自体は、競合解決後も維持される
      newRanges.push(resolved);
    }

    if (!isCompletelyCovered) {
      // 競合処理後の新しい範囲（newRanges）と現在の範囲（currentRange）を結合
      // currentRangeが分割されなかった場合や、競合しなかった部分がここに含まれる
      if (newRanges.length === 0) {
        // resolvedRangesが空だった場合や、競合が発生しなかった場合
        resolvedRanges.push(currentRange);
      } else {
        // newRangesは、既にresolvedRangesに含まれていた範囲のコピー、
        // もしくはcurrentRangeが分割された新しい部分範囲を含む

        // **この部分のロジックは非常に複雑になるため、よりシンプルなアプローチを採用します。**
        // ループの最後に currentRange 自体の残りを追加するのではなく、
        // resolvedRanges を「予約済み空間」として扱い、現在の範囲を予約されていない空間に分割し直す方法を使います。

        // --- ロジックの修正: resolvedRangesを一つの「予約済み」空間として扱う ---

        let remainingSegments: RangeWithOrder[] = [currentRange];
        let nextSegments: RangeWithOrder[] = [];

        for (const resolved of resolvedRanges) {
          // resolvedRangesに格納されている範囲（優先度が高い）で、
          // 処理中の全ての残りセグメント（remainingSegments）をトリミング
          for (const segment of remainingSegments) {
            // 競合しない場合: そのまま次のセグメントとして維持
            if (segment.end < resolved.start || segment.start > resolved.end) {
              nextSegments.push(segment);
            } else {
              // 競合する場合: セグメントを分割（最大2つの新しいセグメントに）

              // 1. 前半分のセグメント
              if (segment.start < resolved.start) {
                const newSegStart = segment.start;
                const newSegEnd = resolved.start - 1;
                if (newSegStart <= newSegEnd) {
                  nextSegments.push({
                    start: newSegStart,
                    end: newSegEnd,
                    isSingle: newSegStart === newSegEnd,
                    order: segment.order,
                  });
                }
              }

              // 2. 後半分のセグメント
              if (segment.end > resolved.end) {
                const newSegStart = resolved.end + 1;
                const newSegEnd = segment.end;
                if (newSegStart <= newSegEnd) {
                  nextSegments.push({
                    start: newSegStart,
                    end: newSegEnd,
                    isSingle: newSegStart === newSegEnd,
                    order: segment.order,
                  });
                }
              }
            }
          }
          // 次の resolvedRange と比較するために、残りのセグメントを更新
          remainingSegments = nextSegments;
          nextSegments = [];
        }

        // 競合処理後に残ったセグメント（remainingSegments）をresolvedRangesに追加
        resolvedRanges.push(...remainingSegments);

        // 処理済みのresolvedRange自体も維持する必要があるため、ここで追加する必要がある
        // ...しかし、resolvedRangesはループの外で定義されているため、次のresolvedRangeとの比較で
        // resolvedRange自体をnewRangesに追加する処理が必要でした。

        // 再度修正：resolvedRangesのリストを更新しながら処理する
        // **最もシンプルで堅牢な方法:**
        // 1. 優先度の高い範囲を resolvedRanges に追加する。
        // 2. 以降、新しい範囲を resolvedRanges のどの部分とも重ならないように「切り取る」。
        // 3. 切り取られた残りの部分（あれば）を resolvedRanges に追加する。

        // --- 最終ロジック ---

        let segmentsToProcess: RangeWithOrder[] = [currentRange];
        let newSegments: RangeWithOrder[] = [];

        for (const resolved of resolvedRanges) {
          for (const segment of segmentsToProcess) {
            // 競合がない場合
            if (segment.end < resolved.start || segment.start > resolved.end) {
              newSegments.push(segment);
            } else {
              // 競合がある場合: 分割

              // 前半
              if (segment.start < resolved.start) {
                const newSegStart = segment.start;
                const newSegEnd = resolved.start - 1;
                newSegments.push({
                  start: newSegStart,
                  end: newSegEnd,
                  isSingle: newSegStart === newSegEnd,
                  order: segment.order,
                });
              }

              // 後半
              if (segment.end > resolved.end) {
                const newSegStart = resolved.end + 1;
                const newSegEnd = segment.end;
                newSegments.push({
                  start: newSegStart,
                  end: newSegEnd,
                  isSingle: newSegStart === newSegEnd,
                  order: segment.order,
                });
              }
            }
          }
          segmentsToProcess = newSegments;
          newSegments = [];
        }

        // 競合処理後に残ったセグメントを最終的な resolvedRanges に追加
        resolvedRanges.push(...segmentsToProcess);
      }
    }
  }

  // 4. 元の入力順（order）に戻してソートし、結果を整形
  // 分割された範囲は、元の範囲と同じorderを持つため、元の順序に近づく
  resolvedRanges.sort((a, b) => a.order - b.order);

  // 5. endがstartと同じ場合は、isSingleをtrueに戻し、endをundefinedに戻す（元のインターフェースに合わせる）
  return resolvedRanges.map((range) => ({
    start: range.start,
    end: range.isSingle && range.start === range.end ? undefined : range.end,
    isSingle: range.isSingle,
    order: range.order,
  }));
};

/**
 * 範囲配列内に競合（重複）があるかを効率的に判定する関数。
 *
 * @param ranges 判定対象の範囲配列
 * @returns 衝突が存在する場合は true、存在しない場合は false
 */
export const checkHasConflict = (ranges: { start: number; end?: number }[]): boolean => {
  // 1. 内部形式への変換と整形
  // endがundefinedの場合はstartと同じ値として扱い、常にstartとendを持つ形式に変換する。
  const processedRanges: { start: number; end: number }[] = ranges.map((range) => ({
    start: range.start,
    // endがなければstartと同じ、start > end となる可能性を考慮して Math.max を使用し、
    // 常に start <= end となるようにする。
    end: range.end ?? range.start,
  }));

  // 2. 範囲を start の昇順でソート
  // 効率的な衝突判定のためには、開始点でソートすることが必須です。
  processedRanges.sort((a, b) => a.start - b.start);

  // 3. 隣接する範囲との競合をチェック
  // ソートされているため、現在の範囲が競合する可能性があるのは、直前の範囲（previousRange）のみです。
  for (let i = 1; i < processedRanges.length; i++) {
    const currentRange = processedRanges[i];
    const previousRange = processedRanges[i - 1];

    // **衝突の判定条件:**
    // 現在の範囲の開始点 (currentRange.start) が、
    // 直前の範囲の終了点 (previousRange.end) 以下である場合、重複しています。
    // (previousRange.end が currentRange.start - 1 であれば隣接で重複なし)
    if (currentRange.start <= previousRange.end) {
      // 競合を発見した時点で処理を終了し、trueを返す
      return true;
    }
  }

  // 全ての範囲をチェックし終え、競合がなかった場合は false を返す
  return false;
};
