import DefaultEnglish from '@/assets/images/plants/adult/english/plant_english_00.png';
import DefaultJapanese from '@/assets/images/plants/adult/japanese/plant_japanese_00.png';
import DefaultMath from '@/assets/images/plants/adult/math/plant_math_00.png';
import DefaultScience from '@/assets/images/plants/adult/science/plant_science_00.png';
import DefaultSocialStudies from '@/assets/images/plants/adult/socialStudies/plant_socialStudies_00.png';
import { Subject } from '@/shared/types/study-shared-types';

export const DEFAULT_PLANTS_MAP: Record<Subject, string> = {
  japanese: DefaultJapanese,
  math: DefaultMath,
  english: DefaultEnglish,
  science: DefaultScience,
  socialStudies: DefaultSocialStudies,
};
