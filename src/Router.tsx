import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { LearningHistoryPage } from './pages/LearningHistory.page';
import { StartStudyPage } from './pages/StartStudy.page';
import { StudyPage } from './pages/Study.page';
import { TextBookPage } from './pages/Textbook.page';
import { TextbookCreatePage } from './pages/TextbookCreate.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/textbooks',
    element: <TextBookPage />,
  },
  {
    path: '/create-textbook',
    element: <TextbookCreatePage />,
  },
  {
    path: '/history',
    element: <LearningHistoryPage />,
  },
  {
    path: '/start-study',
    element: <StartStudyPage />,
  },
  {
    path: '/study',
    element: <StudyPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
