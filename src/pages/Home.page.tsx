import { HomeMain } from '@/features/home/components/HomeMain';
import { TopNavigationBar } from '@/features/navigations/components/TopNavigationBar';

export function HomePage() {
  return (
    <>
      <TopNavigationBar>
        <HomeMain />
      </TopNavigationBar>
    </>
  );
}
