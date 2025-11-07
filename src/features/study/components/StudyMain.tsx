import React, { useMemo, useState } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { range } from '@/shared/utils/range';
import {
  createDummyLearningProblemBases,
  generateDummyTestResults,
} from '../functions/generate-dummy';
import {
  convertResultsToLearningRecordsByIndex,
  createProblemAttemptResults,
} from '../functions/study-utils';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { ProblemAttemptDetail, ProblemScoringStatus } from '../types/problem-types';
import { ParticleOverlay } from './ParticleOverlay';
import { ReviewPhase } from './reviewPhase/ReviewPhase';
import { ScoringPhase } from './scoringPhase/ScoringPhase';
import { StudyPhase } from './studyPhase/StudyPhase';
import { TestPhase } from './testPhase/TestPhase';

interface StudyMainProps {}

type Phase = 'study' | 'test' | 'scoring' | 'review';

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const [subject, setSubject] = useState<Subject>('japanese');

  // 🚀 現在のフェーズを管理する state を追加
  const [phase, setPhase] = useState<Phase>('study'); // 初期フェーズは 'study'

  // ダミーデータ
  const problemBases = createDummyLearningProblemBases(10);

  const header = {
    subject: subject,
    textbookName: '論読',
    units: ['unitA', 'unitB'],
  };

  const theme = useSubjectColorMap(subject);
  const {
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isFinishTestTimer,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    resetAll,
  } = useStudyTimer(problemBases.length);

  const [selfEvaluationMap, setSelfEvaluationMap] = useState<Record<number, TestSelfEvaluation>>(
    {}
  );

  const handleSelfEvaluationMap = (index: number, evaluation: TestSelfEvaluation) => {
    setSelfEvaluationMap((prev) => ({ ...prev, [index]: evaluation }));
  };

  const [scoringStatusMap, setScoringStatusMap] = useState<Record<number, ProblemScoringStatus>>(
    {}
  );

  const handleScoreChange = (
    problem: ProblemAttemptDetail,
    scoringStatus: ProblemScoringStatus
  ) => {
    setScoringStatusMap((prev) => ({
      ...prev,
      [problem.problemIndex]:
        prev[problem.problemIndex] === scoringStatus ? 'unrated' : scoringStatus,
    }));
  };

  const problems = createProblemAttemptResults(
    problemBases,
    selfEvaluationMap,
    scoringStatusMap,
    elapsedTimeMap
  );
  const problems01 = useMemo(() => generateDummyTestResults(10), []);
  const problems02 = useMemo(() => generateDummyTestResults(10), []);

  const dummyProblems = [...problems, ...problems01, ...problems02];

  const records = convertResultsToLearningRecordsByIndex(dummyProblems); // useMemo(() => generateDummyRecords(10), []);

  const [newExpectedDuration, setNewExpectedDuration] = useState(0.1);

  // 🔧 フェーズに基づいてレンダリングするコンポーネントを決定する関数
  const renderPhase = () => {
    switch (phase) {
      case 'study':
        return (
          <StudyPhase
            isReadyTest={studyTimer.remainingTime <= 0}
            header={header}
            plant={{
              subject: subject,
              type: 'adult',
              imageIndex: 2,
            }}
            timer={studyTimer}
            theme={theme}
            switchState={studyTimer.switchState}
            onStartTest={() => setPhase('test')}
            onShowTextRange={() => {}}
          />
        );
      case 'test':
        return (
          <TestPhase
            problems={problems}
            header={header}
            isFinishTestTimer={isFinishTestTimer}
            mainTimer={testTimer}
            currentTimerElapsedTime={currentActiveProblemTimer?.elapsedTime ?? null}
            elapsedTimeMap={elapsedTimeMap}
            theme={theme}
            currentProblemIndex={currentTestProblemIndex ?? 0}
            selfEvaluationMap={selfEvaluationMap}
            onSelectSelfEvaluation={handleSelfEvaluationMap}
            changeCurrentTestProblem={changeCurrentTestProblem}
            switchTimerRunning={handleSwitchTimerRunning}
            onStartScoring={() => setPhase('scoring')}
          />
        );
      case 'scoring':
        return (
          <ScoringPhase
            scoringStatusMap={scoringStatusMap}
            problems={problems}
            header={header}
            theme={theme}
            handleScoreChange={handleScoreChange}
            onStartReview={() => setPhase('review')}
          />
        );
      case 'review':
        return <ReviewPhase records={records} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} gap={500} style={{ backgroundColor: theme.bgScreen }}>
        {/* 🎨 フェーズごとのレンダリングを実行 */}
        {renderPhase()}

        {/* --- テスト用 --- */}
        <Stack mt={50}>
          <Button variant="filled" color="blue" onClick={() => setPhase('study')}>
            Go to Study Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('test')}>
            Go to Test Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('scoring')}>
            Go to Scoring Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('review')}>
            Go to Review Phase
          </Button>

          <Button variant="transparent" onClick={resetAll}>
            resetAll
          </Button>
          <TextInput
            type="number"
            value={newExpectedDuration}
            onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
          />
          <Button
            variant="transparent"
            onClick={() => {
              testTimer.onDurationChange(newExpectedDuration * 60 * 1000);
              studyTimer.onDurationChange(newExpectedDuration * 60 * 1000);
            }}
          >
            更新
          </Button>
          <Flex>
            {range(5).map((index) => {
              const subjects: Subject[] = [
                'japanese',
                'english',
                'math',
                'science',
                'socialStudies',
              ];
              return (
                <Button key={subjects[index]} onClick={() => setSubject(subjects[index])}>
                  {subjects[index]}
                </Button>
              );
            })}
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};
