import { Timestamp } from 'firebase/firestore';
import { Subject } from './study-shared-types';

interface Textbook {
  subject: Subject;
  name: string;
  totalStudyCount: number;
  latestStudyAt: Timestamp;
}
