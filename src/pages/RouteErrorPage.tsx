import { useRouteError } from 'react-router';
import { ErrorState } from '../components/ErrorState';

export function RouteErrorPage() {
  const error = useRouteError();
  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <ErrorState
        title="Algo deu errado"
        description="Ocorreu um erro inesperado ao exibir esta página."
        onRetry={() => window.location.reload()}
      />
    </main>
  );
}
