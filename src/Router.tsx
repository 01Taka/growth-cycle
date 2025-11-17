import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CustomErrorFallback from './features/error/CustomErrorFallback';
import { HomePage } from './pages/Home.page';
import { LearningHistoryPage } from './pages/LearningHistory.page';
import { StartStudyPage } from './pages/StartStudy.page';
import { StudyPage } from './pages/Study.page';
import { TextBookPage } from './pages/Textbook.page';
import { TextbookCreatePage } from './pages/TextbookCreate.page';

// router.tsx または該当のファイル

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <CustomErrorFallback />,
  },
  {
    path: '/textbooks',
    element: <TextBookPage />,
    errorElement: <CustomErrorFallback />,
  },
  {
    path: '/create-textbook',
    element: <TextbookCreatePage />,
    errorElement: <CustomErrorFallback />,
  },
  {
    path: '/history',
    element: <LearningHistoryPage />,
    errorElement: <CustomErrorFallback />,
  },
  {
    path: '/start-study',
    element: <StartStudyPage />,
    errorElement: <CustomErrorFallback />,
  },
  {
    path: '/study',
    element: <StudyPage />,
    errorElement: <CustomErrorFallback />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
