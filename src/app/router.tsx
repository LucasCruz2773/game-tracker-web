import { createBrowserRouter } from 'react-router';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RequireAuth } from '../features/auth/components/RequireAuth';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import { AppLayout } from './AppLayout';

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [{ index: true, element: <HomePage /> }],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
