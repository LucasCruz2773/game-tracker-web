import { Navigate, useSearchParams } from 'react-router';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { Logo } from '../../../components/Logo';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { signInErrorMessage } from '../sign-in-errors';
import { useCurrentUser } from '../use-current-user';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const { data: currentUser, isPending } = useCurrentUser();
  const errorMessage = signInErrorMessage(searchParams.get('error'));

  if (isPending) {
    return <LoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold">Sua biblioteca de jogos</h1>
          <p className="text-sm text-zinc-400">
            Organize o que você está jogando, acompanhe seu progresso e avalie o
            que já terminou.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          >
            {errorMessage}
          </p>
        )}

        <GoogleSignInButton />
      </div>
    </main>
  );
}
