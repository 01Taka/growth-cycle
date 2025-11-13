export interface XPResults {
  correctRate: number;

  qualityScore: number;
  qualityEffortDurationScore: number;

  correctnessXpBase: number;
  correctnessBonusScore: number;
  correctnessBonusType: 'highScore' | 'growth' | 'none';
  correctnessSpeedMultiplier: number;

  xpLearningTime: number;
  xpPlantGrowth: number;
  xpQuality: number;
  xpCorrectness: number;
  floatTotalXP: number;
  totalXP: number;
}
