import { CycleListItemAggregatedSection } from '../types/cycle-list-types';

// 1日をミリ秒で定義する定数
export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

// 見直し推奨ステージの境界となる日数を定義する定数
// 値は「この日数未満」で次のステージになることを意味します。
export const REVIEW_RECOMMENDATION_STAGE_THRESHOLDS_IN_DAYS = {
  STAGE_1_MAX: 1, // 1日未満
  STAGE_2_MAX: 3, // 3日未満
  STAGE_3_MAX: 7, // 7日未満
  STAGE_4_MAX: 30, // 30日未満
} as const;

export const REVIEW_STAGES: Omit<CycleListItemAggregatedSection, 'value'>[] = [
  {
    // ステージ 0: 見直し必須 (期限切れ or 前回不合格)
    stage: 0,
    color: '#dc3545', // Bootstrapのdangerに相当 (赤)
    description: '見直し必須：期限切れまたは前回不合格',
    striped: true, // 見直し必須はストライプ表示
  },
  {
    // ステージ 1: 見直し推奨（最優先）
    stage: 1,
    color: '#ffc107', // Bootstrapのwarningに相当 (濃い黄)
    description: '見直し推奨：24時間以内に期限が来る',
    striped: false,
  },
  {
    // ステージ 2: 見直し推奨（高優先度）
    stage: 2,
    color: '#ffecb3', // 薄い黄色
    description: '見直し推奨：1日から3日以内に期限が来る',
    striped: false,
  },
  {
    // ステージ 3: 見直し推奨（中優先度）
    stage: 3,
    color: '#17a2b8', // Bootstrapのinfoに相当 (青)
    description: '見直し推奨：3日から7日以内に期限が来る',
    striped: false,
  },
  {
    // ステージ 4: 見直し推奨（低優先度）
    stage: 4,
    color: '#28a745', // Bootstrapのsuccessに相当 (緑)
    description: '見直し推奨：7日から30日以内に期限が来る',
    striped: false,
  },
  {
    // ステージ 5: 安定定着（最低優先度）
    stage: 5,
    color: '#6c757d', // Bootstrapのsecondaryに相当 (灰)
    description: '安定定着：30日以上先に期限が来る',
    striped: false,
  },
] as const;
