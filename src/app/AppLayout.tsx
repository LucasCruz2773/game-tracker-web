import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router';
import { Logo } from '../components/Logo';
import { UserMenu } from '../features/auth/components/UserMenu';
import { useAuthenticatedUser } from '../features/auth/use-current-user';

const NAV_ITEMS = [
  { to: '/', label: 'Explorar', end: true },
  { to: '/library', label: 'Minha biblioteca', end: false },
  { to: '/dashboard', label: 'Resumo', end: false },
  { to: '/integrations', label: 'Integrações', end: false },
];

export function AppLayout() {
  const currentUser = useAuthenticatedUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="rounded focus-visible:outline-2 focus-visible:outline-violet-500"
            >
              <Logo />
            </Link>
            <nav aria-label="Principal" className="flex gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-violet-500 ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <UserMenu user={currentUser} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        Dados de jogos fornecidos por{' '}
        <a
          href="https://rawg.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-300 underline-offset-2 hover:underline"
        >
          RAWG
        </a>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
