import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
