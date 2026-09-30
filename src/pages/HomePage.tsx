import { useAuthenticatedUser } from '../features/auth/use-current-user';

export function HomePage() {
  const currentUser = useAuthenticatedUser();
  const firstName = (currentUser.displayName ?? currentUser.username).split(
    ' ',
  )[0];

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-semibold">Olá, {firstName}!</h1>
      <p className="text-zinc-400">
        Em breve você vai poder buscar jogos e montar sua biblioteca por aqui.
      </p>
    </section>
  );
}
