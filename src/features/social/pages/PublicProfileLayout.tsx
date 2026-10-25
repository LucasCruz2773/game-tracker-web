import { Link, NavLink, Outlet, useParams } from 'react-router';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { UserAvatar } from '../../auth/components/UserAvatar';
import { useAuthenticatedUser } from '../../auth/use-current-user';
import { usePublicProfile, useToggleFollow } from '../use-social';

const memberSinceFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

export function PublicProfileLayout() {
  const { username = '' } = useParams();
  const currentUser = useAuthenticatedUser();
  const profile = usePublicProfile(username);
  const toggleFollow = useToggleFollow();

  if (profile.isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Carregando perfil…" />
      </div>
    );
  }

  if (profile.isError) {
    return (
      <ErrorState
        title="Não foi possível abrir este perfil"
        description="O jogador pode não existir ou a conexão falhou."
        onRetry={() => void profile.refetch()}
      />
    );
  }

  const player = profile.data;
  const createdAt = new Date(player.createdAt);
  const memberSince = Number.isNaN(createdAt.getTime())
    ? player.createdAt
    : memberSinceFormatter.format(createdAt);
  const isOwnProfile = player.id === currentUser.id;

  return (
    <section className="space-y-6">
      <header className="retro-panel overflow-hidden rounded-xl">
        <div className="retro-grid p-5 sm:p-6">
          <Link
            to="/players"
            className="console-secondary-button inline-flex rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wider uppercase focus-visible:outline-2"
          >
            ← Jogadores
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <UserAvatar user={player} size="large" />
            <div className="min-w-0 flex-1">
              <p className="retro-kicker">Player profile // Public file</p>
              <h1 className="retro-title mt-1 truncate text-2xl font-bold sm:text-3xl">
                @{player.username}
              </h1>
              <dl className="mt-4 flex gap-2 text-center">
                <SocialCount count={player.followerCount} label="Seguidores" />
                <SocialCount count={player.followingCount} label="Seguindo" />
              </dl>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <p className="text-xs text-zinc-700">
                Jogando desde{' '}
                <span className="font-bold capitalize">{memberSince}</span>
              </p>
              {isOwnProfile ? (
                <Link
                  to="/profile"
                  className="console-secondary-button rounded-lg border px-4 py-2 text-center text-xs font-bold tracking-wider uppercase focus-visible:outline-2"
                >
                  Meu perfil
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={toggleFollow.isPending}
                  onClick={() =>
                    toggleFollow.mutate({
                      username: player.username,
                      currentlyFollowing: player.isFollowing,
                    })
                  }
                  className={`${
                    player.isFollowing
                      ? 'console-secondary-button'
                      : 'theme-primary-button'
                  } rounded-lg border px-5 py-2 text-xs font-bold tracking-wider uppercase disabled:opacity-50 focus-visible:outline-2`}
                >
                  {toggleFollow.isPending
                    ? 'Salvando…'
                    : player.isFollowing
                      ? 'Seguindo'
                      : 'Seguir'}
                </button>
              )}
              {toggleFollow.isError && (
                <p role="alert" className="max-w-56 text-xs text-red-500">
                  Não foi possível atualizar esta conexão.
                </p>
              )}
            </div>
          </div>
        </div>

        <nav
          aria-label={`Seções do perfil de ${player.username}`}
          className="flex border-t border-zinc-600/60"
        >
          <ProfileTab to="library" label="Biblioteca" />
          <ProfileTab to="summary" label="Resumo" />
        </nav>
      </header>

      <Outlet />
    </section>
  );
}

function SocialCount({ count, label }: { count: number; label: string }) {
  return (
    <div className="min-w-24 rounded-lg border border-zinc-600/60 bg-white/15 px-3 py-2">
      <dd className="font-bold leading-none tabular-nums">
        {count.toLocaleString('pt-BR')}
      </dd>
      <dt className="mt-1 text-[0.6rem] tracking-wider text-zinc-700 uppercase">
        {label}
      </dt>
    </div>
  );
}

function ProfileTab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 border-b-2 px-4 py-3 text-center text-xs font-bold tracking-wider uppercase focus-visible:outline-2 ${
          isActive
            ? 'theme-nav-active border-current'
            : 'theme-nav-item border-transparent'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
