import React from 'react';
import { IconPlayerPlay, IconVolume, IconVolumeOff } from '@tabler/icons-react';
import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  rem,
  Slider,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useSoundPermissionModal } from './useSoundPermissionModal';

const SLIDER_MARKS = [
  { value: 0, label: '0' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
  { value: 100, label: '100' },
];

export const SoundPermissionModal: React.FC = () => {
  const {
    open,
    loading,
    playTestSound,
    setGlobalVolume,
    handleAllowSound,
    handleClose,
    handleDenySound,
  } = useSoundPermissionModal();

  const theme = useMantineTheme();

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      title="🎧 音声の許可をお願いします"
      // モバイル向けに全画面表示、またはサイズを大きく設定
      fullScreen={false} // 必要に応じてモバイルではtrueに
      size="md"
      centered
      // 許可なしで閉じられないようにする（UXに応じて変更可能）
      closeOnClickOutside={false}
      closeOnEscape={false}
      // モバイルで画面上部にタイトルを表示するために、padding-topを調整
      styles={{
        header: {
          paddingBottom: rem(0),
        },
        body: {
          paddingTop: rem(10),
        },
      }}
    >
      <Stack gap="xl" align="stretch">
        <Text size="sm" c="dimmed">
          この学習アプリでは、効果音やナレーションを使用して学習をサポートします。
          再生にはユーザー操作による許可が必要です。音量を調整し、「許可する」を押してください。
        </Text>

        {/* --- 音量調整スライダー --- */}
        <Stack gap="xs">
          <Text fw={500} size="sm">
            音量の確認と調整
          </Text>
          <Group gap="md" wrap="nowrap" align="center">
            <IconVolumeOff
              style={{ width: rem(20), height: rem(20) }}
              color={theme.colors.gray[6]}
            />
            <Slider
              defaultValue={50}
              min={0}
              max={100}
              step={10}
              marks={SLIDER_MARKS}
              label={(value) => `${value}%`}
              onChange={(value) => setGlobalVolume(value / 100)} // 0-100を0-1に変換
              style={{ flexGrow: 1 }}
            />
            <IconVolume style={{ width: rem(20), height: rem(20) }} color={theme.colors.gray[6]} />
          </Group>
        </Stack>

        {/* --- テスト音再生ボタン --- */}
        <Button
          variant="light"
          onClick={playTestSound}
          leftSection={<IconPlayerPlay size={18} />}
          disabled={loading}
          fullWidth
          color="blue"
        >
          テスト音を鳴らす
        </Button>

        {/* --- 許可/拒否ボタン --- */}
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={handleDenySound} disabled={loading} color="gray">
            許可しない
          </Button>
          <Button
            onClick={handleAllowSound}
            loading={loading}
            loaderProps={{ type: 'dots' }}
            color="teal"
            size="lg" // 許可ボタンを大きくして強調
          >
            音声を許可する
          </Button>
        </Group>
      </Stack>
      {/* ロード中はモーダル全体を覆うローダー（任意） */}
      {loading && (
        <Center
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Loader />
        </Center>
      )}
    </Modal>
  );
};
