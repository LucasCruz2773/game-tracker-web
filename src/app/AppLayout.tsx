import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { UserMenu } from '../features/auth/components/UserMenu';
import { useAuthenticatedUser } from '../features/auth/use-current-user';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Explorar',
    shortLabel: 'Explorar',
    symbol: '△',
    end: true,
  },
  {
    to: '/library',
    label: 'Minha biblioteca',
    shortLabel: 'Biblioteca',
    symbol: '□',
    end: false,
  },
  {
    to: '/dashboard',
    label: 'Resumo',
    shortLabel: 'Resumo',
    symbol: '○',
    end: false,
  },
  {
    to: '/integrations',
    label: 'Integrações',
    shortLabel: 'Conexões',
    symbol: '×',
    end: false,
  },
];

const SYMBOL_CLASSES = [
  'text-emerald-400',
  'text-fuchsia-400',
  'text-brand-400',
  'text-blue-400',
];

export function AppLayout() {
  const currentUser = useAuthenticatedUser();
  const location = useLocation();
  const currentSection =
    NAV_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.shortLabel ?? 'Detalhes do jogo';

  return (
    <div className="ps-shell min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="app-sidebar sticky top-0 hidden h-screen flex-col border-r lg:flex">
        <div className="app-sidebar-brand flex h-28 items-center border-b px-6">
          <Link
            to="/"
            className="focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <Logo large />
          </Link>
        </div>

        <div className="flex flex-1 flex-col px-5 py-8">
          <p className="mb-3 text-sm tracking-[0.14em] text-zinc-700 uppercase">
            Menu principal
          </p>
          <nav aria-label="Principal" className="space-y-1.5">
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `pixel-corners group flex items-center gap-3 px-3 py-3 text-base tracking-wide focus-visible:outline-2 focus-visible:outline-brand-500 ${
                    isActive
                      ? 'theme-nav-active text-white shadow-[3px_3px_0_#05060a]'
                      : 'theme-nav-item'
                  }`
                }
              >
                <span
                  aria-hidden="true"
                  className={`w-7 text-center text-3xl leading-none ${SYMBOL_CLASSES[index]}`}
                >
                  {item.symbol}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-zinc-600/60 pt-6">
            <p className="retro-kicker">Memory card</p>
            <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden="true">
              {Array.from({ length: 16 }, (_, index) => (
                <span
                  key={index}
                  className={`aspect-square border border-zinc-700 ${
                    index < 5 ? 'memory-block-used' : 'memory-block-empty'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-700">05 / 16 blocos usados</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="app-header sticky top-0 z-40 border-b backdrop-blur-md">
          <div className="theme-accent-line h-0.5" />
          <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="shrink-0 focus-visible:outline-2 focus-visible:outline-brand-500 lg:hidden"
            >
              <Logo />
            </Link>
            <div className="hidden lg:block">
              <p className="retro-kicker">GameTrack OS // Online</p>
              <p className="mt-0.5 text-lg tracking-wider text-zinc-950 uppercase">
                {currentSection}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu user={currentUser} />
            </div>
          </div>
          <nav
            aria-label="Principal para dispositivos móveis"
            className="app-mobile-nav flex w-full overflow-x-auto border-t lg:hidden"
          >
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-w-24 flex-1 shrink-0 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs uppercase focus-visible:outline-2 focus-visible:outline-brand-500 ${
                    isActive
                      ? 'theme-nav-active border-current text-white'
                      : 'theme-nav-item border-transparent'
                  }`
                }
              >
                <span
                  aria-hidden="true"
                  className={`text-xl ${SYMBOL_CLASSES[index]}`}
                >
                  {item.symbol}
                </span>
                {item.shortLabel}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <Outlet />
        </main>

        <footer className="app-footer border-t py-5 text-center text-xs">
          <p className="tracking-wider uppercase">
            GameTrack // Dados fornecidos por{' '}
            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 underline-offset-2 hover:text-brand-300 hover:underline"
            >
              RAWG
            </a>
          </p>
        </footer>
      </div>

      <ScrollRestoration />
    </div>
  );
}
