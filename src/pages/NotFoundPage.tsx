import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold text-violet-400">404</p>
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <Link
        to="/"
        className="text-sm text-zinc-300 underline-offset-2 hover:underline"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
