export interface XPResults {
  correctRate: number;

  qualityScore: number;
  qualityEffortDurationScore: number;

  correctnessXpBase: number;
  correctnessBonusScore: number;
  correctnessBonusType: string;
  correctnessSpeedMultiplier: number;

  xpLearningTime: number;
  xpPlantGrowth: number;
  xpQuality: number;
  xpCorrectness: number;
  floatTotalXP: number;
  totalXP: number;
}
