import { createBrowserRouter } from 'react-router';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RequireAuth } from '../features/auth/components/RequireAuth';
import { GameDetailsPage } from '../features/games/pages/GameDetailsPage';
import { GamesPage } from '../features/games/pages/GamesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LibraryPage } from '../features/library/pages/LibraryPage';
import { IntegrationsPage } from '../features/integrations/pages/IntegrationsPage';
import { PlayersPage } from '../features/social/pages/PlayersPage';
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
            children: [
              { index: true, element: <GamesPage /> },
              { path: 'games/:gameId', element: <GameDetailsPage /> },
              { path: 'library', element: <LibraryPage /> },
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'players', element: <PlayersPage /> },
              { path: 'integrations', element: <IntegrationsPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
