import { NavLink, Outlet } from 'react-router';
import { UserAvatar } from '../../auth/components/UserAvatar';
import { useAuthenticatedUser } from '../../auth/use-current-user';
import { useSocialSummary } from '../../social/use-social';

const PROFILE_TABS = [
  { to: '/profile', label: 'Perfil', end: true },
  { to: '/profile/edit', label: 'Editar perfil', end: false },
  { to: '/profile/library', label: 'Biblioteca', end: false },
  { to: '/profile/summary', label: 'Resumo', end: false },
  { to: '/profile/integrations', label: 'Integrações', end: false },
] as const;

const memberSinceFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

export function ProfileLayout() {
  const user = useAuthenticatedUser();
  const socialSummary = useSocialSummary();
  const createdAt = new Date(user.createdAt);
  const memberSince = Number.isNaN(createdAt.getTime())
    ? user.createdAt
    : memberSinceFormatter.format(createdAt);

  return (
    <section className="space-y-6">
      <header className="retro-panel overflow-hidden rounded-xl">
        <div className="retro-grid flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <UserAvatar user={user} size="large" />
          <div className="min-w-0 flex-1">
            <p className="retro-kicker">Player profile // Memory file</p>
            <h1 className="retro-title mt-1 truncate text-2xl font-bold sm:text-3xl">
              @{user.username}
            </h1>
            <nav aria-label="Conexões sociais" className="mt-4 flex gap-2">
              <SocialCounter
                to="/profile/followers"
                count={socialSummary.data?.followerCount}
                label="Seguidores"
              />
              <SocialCounter
                to="/profile/following"
                count={socialSummary.data?.followingCount}
                label="Seguindo"
              />
            </nav>
          </div>
          <dl className="grid shrink-0 gap-3 text-sm sm:text-right">
            <div>
              <dt className="text-[0.65rem] tracking-wider text-zinc-700 uppercase">
                Conta
              </dt>
              <dd className="truncate">{user.email}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-wider text-zinc-700 uppercase">
                Jogando desde
              </dt>
              <dd className="capitalize">{memberSince}</dd>
            </div>
          </dl>
        </div>

        <nav
          aria-label="Seções do perfil"
          className="flex overflow-x-auto border-t border-zinc-600/60"
        >
          {PROFILE_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `min-w-max flex-1 border-b-2 px-4 py-3 text-center text-xs font-bold tracking-wider uppercase focus-visible:outline-2 ${
                  isActive
                    ? 'theme-nav-active border-current'
                    : 'theme-nav-item border-transparent'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet />
    </section>
  );
}

interface SocialCounterProps {
  to: string;
  count: number | undefined;
  label: string;
}

function SocialCounter({ to, count, label }: SocialCounterProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `min-w-24 rounded-lg border px-3 py-2 text-center transition focus-visible:outline-2 ${
          isActive
            ? 'theme-nav-active border-current'
            : 'console-secondary-button'
        }`
      }
    >
      <strong className="block text-base leading-none tabular-nums">
        {count === undefined ? '…' : count.toLocaleString('pt-BR')}
      </strong>
      <span className="mt-1 block text-[0.6rem] tracking-wider uppercase">
        {label}
      </span>
    </NavLink>
  );
}
