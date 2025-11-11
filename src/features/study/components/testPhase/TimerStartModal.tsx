import React from 'react';
import { IconClockHour3, IconListCheck, IconRocket } from '@tabler/icons-react';
import { Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { LearningProblemKey } from '../../types/problem-types';
import { LearningProblemKeyList } from '../shared/problemList/LearningProblemKeyList';

interface TimerStartModalProps {
  isStarted: boolean;
  remainingTimeMin: number;
  problems: LearningProblemKey[];
  theme: SubjectColorMap;
  opened: boolean;
  onClose: () => void;
  onStartTest: () => void;
}

export const TimerStartModal: React.FC<TimerStartModalProps> = ({
  isStarted,
  remainingTimeMin,
  problems,
  theme,
  opened,
  onClose,
  onStartTest,
}) => {
  const remainingTimeText = isStarted ? '残り時間' : 'テスト時間';
  const modalTitle = isStarted ? 'テストを再開します' : 'テストを開始します';
  const startButtonText = isStarted ? '再開' : '開始';
  const accentColor = theme.accent;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={700} c={accentColor} style={{ display: 'flex', alignItems: 'center' }}>
          <IconRocket size={24} style={{ marginRight: '8px' }} />
          {modalTitle}
        </Text>
      }
      centered
      size="md"
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="xl">
        {/* === テスト情報セクション === */}
        <Box
          p="md"
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            backgroundColor: theme.bgCard,
          }}
        >
          {/* Stackのspacingはgapに変わりました */}
          <Stack gap="sm">
            {/* 時間情報 */}
            {/* Groupのspacingはgapに変わりました */}
            <Group gap="xs" align="center">
              <IconClockHour3 size={20} color={theme.text} />
              {/* weightはfwに変わりました */}
              <Text size="md" fw={500}>
                {remainingTimeText}:
                <Text span c={accentColor} fw={700}>
                  {remainingTimeMin}分
                </Text>
              </Text>
            </Group>

            {/* 問題数情報 */}
            {/* Groupのspacingはgapに変わりました */}
            <Group gap="xs" align="center">
              <IconListCheck size={20} color={theme.text} />
              {/* weightはfwに変わりました */}
              <Text size="md" fw={500}>
                問題数:
                <Text span c={accentColor} fw={700}>
                  {problems.length}問
                </Text>
              </Text>
            </Group>

            {/* colorはcに変わりました */}
            <Text size="sm" c="dimmed" mt="xs">
              準備ができたら、下のボタンを押してテスト{startButtonText}してください。
            </Text>
          </Stack>
        </Box>

        {/* === ボタンと問題リスト === */}
        <Stack gap="lg">
          <Button
            size="lg"
            fullWidth
            onClick={onStartTest}
            c={theme.textRevers}
            bg={accentColor}
            radius="md"
            rightSection={<IconRocket size={20} />}
            style={{
              position: 'sticky',
              top: 60,
              zIndex: 2000,
            }}
          >
            テスト{startButtonText}
          </Button>

          {/* 問題リストセクション */}
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              含まれる問題 ({problems.length}件):
            </Text>
            <LearningProblemKeyList problems={problems} theme={theme} headerTop={110} />
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};
