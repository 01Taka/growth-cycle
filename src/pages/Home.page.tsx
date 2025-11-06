import { Stack } from '@mantine/core';
import { HomeMain } from '@/features/home/components/HomeMain';
import { TopNavigationBar } from '@/features/navigations/components/TopNavigationBar';
import { StartStudyPage } from './StartStudy.page';
import { StudyPage } from './Study.page';
import { TextBookPage } from './Textbook.page';

export function HomePage() {
  return (
    <>
      {/* <TopNavigationBar> */}
      <Stack gap={500}>
        <HomeMain />
        {/* <TextBookPage />
        <StartStudyPage />
        <StudyPage /> */}
      </Stack>
      {/* </TopNavigationBar> */}
    </>
  );
}
