import {
  MILLISECONDS_IN_DAY,
  REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS,
} from '../../constants/review-recommendation-stage-constants';

/**
 * SM-2データに基づき、問題の現在の見直し推奨ステージを計算します。
 *
 * 0: 見直し必須（最優先）
 * 1-4: 見直し推奨（値が小さいほど推奨度が高い、つまり次の見直し日が近い）
 * 5: 安定定着（推奨度最低、またはその他の状態）
 *
 * @param data 見直しに必要なデータオブジェクト
 * @returns {number} 見直し推奨ステージ (0～5)
 */
export function calcReviewRecommendationStage(
  differenceFromNextAttempt: number,
  sm2Quality: number
): number {
  // --- 1. 見直し必須 (最優先: 0) の判定 ---
  // differenceFromNextAttempt が負の値（見直し期限切れ）
  // または sm2Quality が 3 未満（前回間違えた/難しかった）
  if (differenceFromNextAttempt < 0 || sm2Quality < 3) {
    return 0; // 見直し必須
  }

  // --- 2. 見直し推奨 (1-4) の判定 ---
  // differenceFromNextAttempt が正の値（見直し期限内）の場合、残りの時間で推奨度を分ける

  // 見直しまでの時間差を「日数」に変換
  const diffInDays = differenceFromNextAttempt / MILLISECONDS_IN_DAY;

  // 推奨度が高い順（見直し日が近い順）にステージを割り当てる
  if (diffInDays < REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS.STAGE_1_MAX) {
    return 1; // 推奨度: 最も高い
  } else if (diffInDays < REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS.STAGE_2_MAX) {
    return 2;
  } else if (diffInDays < REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS.STAGE_3_MAX) {
    return 3;
  } else if (diffInDays < REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS.STAGE_4_MAX) {
    return 4;
  }

  // --- 3. 安定定着 (5) の判定 ---
  // 30日以上先に見直し推奨日が設定されている（長期記憶に移行したと見なす）
  return 5; // 推奨度: 最も低い / 安定定着
}
