import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { StartStudyPage } from './pages/StartStudy.page';
import { TextBookPage } from './pages/Textbook.page';

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
    path: '/start-study',
    element: <StartStudyPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
