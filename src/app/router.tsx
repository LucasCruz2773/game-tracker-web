import { createBrowserRouter } from 'react-router';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RequireAuth } from '../features/auth/components/RequireAuth';
import { GameDetailsPage } from '../features/games/pages/GameDetailsPage';
import { GamesPage } from '../features/games/pages/GamesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LibraryPage } from '../features/library/pages/LibraryPage';
import { IntegrationsPage } from '../features/integrations/pages/IntegrationsPage';
import { PlayersPage } from '../features/social/pages/PlayersPage';
import { ProfileLayout } from '../features/profile/pages/ProfileLayout';
import { ProfileOverviewPage } from '../features/profile/pages/ProfileOverviewPage';
import { ProfileSettingsPage } from '../features/profile/pages/ProfileSettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import { AppLayout } from './AppLayout';
import { LegacyProfileRedirect } from './LegacyProfileRedirect';

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
              { path: 'players', element: <PlayersPage /> },
              {
                path: 'profile',
                element: <ProfileLayout />,
                children: [
                  { index: true, element: <ProfileOverviewPage /> },
                  { path: 'edit', element: <ProfileSettingsPage /> },
                  { path: 'library', element: <LibraryPage /> },
                  { path: 'summary', element: <DashboardPage /> },
                  { path: 'integrations', element: <IntegrationsPage /> },
                ],
              },
              {
                path: 'library',
                element: <LegacyProfileRedirect to="/profile/library" />,
              },
              {
                path: 'dashboard',
                element: <LegacyProfileRedirect to="/profile/summary" />,
              },
              {
                path: 'integrations',
                element: <LegacyProfileRedirect to="/profile/integrations" />,
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
