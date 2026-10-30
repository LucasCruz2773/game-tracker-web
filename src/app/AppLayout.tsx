import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import { useState } from 'react';
import { Logo } from '../components/Logo';
import { LanguageSelect } from '../components/LanguageSelect';
import { ThemeToggle } from '../components/ThemeToggle';
import { UserMenu } from '../features/auth/components/UserMenu';
import { useAuthenticatedUser } from '../features/auth/use-current-user';
import { useI18n, type TranslationKey } from '../i18n/i18n';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'explore',
    shortLabel: 'explore',
    symbol: '△',
    end: true,
  },
  {
    to: '/feed',
    label: 'activities',
    shortLabel: 'activities',
    symbol: '×',
    end: false,
  },
  {
    to: '/players',
    label: 'players',
    shortLabel: 'players',
    symbol: '□',
    end: false,
  },
  {
    to: '/profile',
    label: 'profile',
    shortLabel: 'profile',
    symbol: '○',
    end: false,
  },
  {
    to: '/contact',
    label: 'contact',
    shortLabel: 'contact',
    symbol: '+',
    end: false,
  },
];

const SYMBOL_CLASSES = [
  'text-emerald-400',
  'text-sky-400',
  'text-fuchsia-400',
  'text-brand-400',
  'text-amber-400',
];

const SIDEBAR_STORAGE_KEY = 'gametrack-sidebar-collapsed';

function isSidebarInitiallyCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AppLayout() {
  const { t } = useI18n();
  const currentUser = useAuthenticatedUser();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    isSidebarInitiallyCollapsed,
  );
  const currentSection =
    NAV_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.shortLabel ?? 'gameDetails';

  function toggleSidebar() {
    const nextCollapsed = !sidebarCollapsed;

    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextCollapsed));
    } catch {
      // The menu still collapses when storage is unavailable.
    }

    setSidebarCollapsed(nextCollapsed);
  }

  return (
    <div
      className={`ps-shell min-h-screen lg:grid ${
        sidebarCollapsed
          ? 'lg:grid-cols-1'
          : 'lg:grid-cols-[16rem_minmax(0,1fr)]'
      }`}
    >
      <aside
        id="app-sidebar"
        className={`app-sidebar sticky top-0 hidden h-screen flex-col border-r ${
          sidebarCollapsed ? 'lg:hidden' : 'lg:flex'
        }`}
      >
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
            {t('mainMenu')}
          </p>
          <nav aria-label={t('mainNav')} className="space-y-1.5">
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
                {t(item.label as TranslationKey)}
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
            <p className="mt-2 text-xs text-zinc-700">{t('blocksUsed')}</p>
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
            <div className="hidden items-center gap-4 lg:flex">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-controls="app-sidebar"
                aria-expanded={!sidebarCollapsed}
                aria-label={
                  sidebarCollapsed ? t('showSidebar') : t('hideSidebar')
                }
                title={sidebarCollapsed ? t('showSidebar') : t('hideSidebar')}
                className="theme-toggle pixel-corners inline-flex size-10 items-center justify-center border focus-visible:outline-2"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="16" />
                  <path d="M9 4v16" />
                  <path
                    d={sidebarCollapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'}
                  />
                </svg>
              </button>
              <div>
                <p className="retro-kicker">GameTrack OS // Online</p>
                <p className="mt-0.5 text-lg tracking-wider text-zinc-950 uppercase">
                  {t(currentSection as TranslationKey)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelect />
              <ThemeToggle />
              <UserMenu user={currentUser} />
            </div>
          </div>
          <nav
            aria-label={t('mobileNav')}
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
                {t(item.shortLabel as TranslationKey)}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <Outlet />
        </main>

        <footer className="app-footer border-t py-5 text-center text-xs">
          <p className="tracking-wider uppercase">
            {t('providedBy')}{' '}
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
