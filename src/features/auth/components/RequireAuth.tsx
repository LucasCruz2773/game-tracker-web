import { Navigate, Outlet } from 'react-router';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { useCurrentUser } from '../use-current-user';

export function RequireAuth() {
  const { data: currentUser, isPending, isError, refetch } = useCurrentUser();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState
          title="Não foi possível carregar sua sessão"
          description="O servidor não respondeu. Verifique sua conexão e tente novamente."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  if (currentUser === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
