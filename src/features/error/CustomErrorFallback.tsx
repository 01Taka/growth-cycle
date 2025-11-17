import React from 'react';
import { IconHome2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Container, Image, rem, Stack, Text, Title } from '@mantine/core';
import ErrorImage02 from '../../../public/assets/images/error-image-01.png';
import ErrorImage01 from '../../../public/assets/images/error-image-02.png';

/**
 * カスタムエラー画面コンポーネント
 * @param {FallbackProps} props - react-error-boundary から渡されるプロパティ (error, resetErrorBoundary)
 */
const CustomErrorFallback: React.FC = ({}) => {
  const navigate = useNavigate();
  const placeholderImageUrl = Date.now() % 2 === 0 ? ErrorImage01 : ErrorImage02;

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Center style={{ width: '100vw', height: '100vh', padding: rem(20) }}>
      <Stack align="center" gap="xl" style={{ textAlign: 'center' }}>
        {/* 1. 画像 (画面中央) */}
        <Image
          src={placeholderImageUrl}
          alt="エラーが発生したことを示す画像"
          radius="md"
          w={500} // モバイル向けにサイズを制限
          h={400}
          fit="cover"
        />

        {/* 2. エラーメッセージ (画面中央) */}
        <Container w="100%">
          <Title order={2} c="red.6" mb="sm">
            エラーが発生しました
          </Title>
          <Text c="dimmed" size="md">
            申し訳ありません。予期せぬ問題が発生しました。
          </Text>
          {/* 開発時デバッグ用: エラー詳細を表示 */}
          {/* <Text size="sm" c="gray.5">詳細: {error.message}</Text> */}
        </Container>

        {/* 3. ホームに戻るボタン (画面下部寄り) */}
        <Button
          leftSection={<IconHome2 size={18} />}
          variant="filled"
          color="red"
          size="md"
          onClick={handleGoHome}
          mt="lg"
        >
          ホームに戻る
        </Button>
      </Stack>
    </Center>
  );
};

export default CustomErrorFallback;
