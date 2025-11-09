import { IconPlus } from '@tabler/icons-react'; // アイコンライブラリ
import { ActionIcon, Affix, MantineStyleProp, rem } from '@mantine/core';

interface NewFABProps {
  onClick?: () => void;
  style?: MantineStyleProp;
}

export const NewFAB: React.FC<NewFABProps> = ({ style, onClick }) => {
  return (
    // Affix: FABを画面の右下に固定
    <Affix position={{ bottom: rem(40), right: rem(40) }}>
      {/* ActionIcon: 丸いボタンとアイコン */}
      <ActionIcon
        size={rem(60)} // 大きさ
        radius="xl" // 真円にする
        variant="filled" // 塗りつぶし
        aria-label="新規作成" // アクセシビリティ
        onClick={onClick}
        style={style}
      >
        <IconPlus style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </ActionIcon>
    </Affix>
  );
};
