import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-mono text-5xl font-black text-brand-500 drop-shadow-[3px_3px_0_rgba(255,255,255,0.12)]">
        404
      </p>
      <h1 className="retro-title text-2xl font-semibold">
        Página não encontrada
      </h1>
      <Link
        to="/"
        className="text-sm font-bold text-zinc-800 underline-offset-2 hover:underline"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
