import { useState } from 'react';
import { useI18n } from '../i18n/i18n';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'gametrack-theme';

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  function changeTheme() {
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={changeTheme}
      aria-label={nextTheme === 'dark' ? t('activateDark') : t('activateLight')}
      title={theme === 'light' ? t('currentLight') : t('currentDark')}
      className="theme-toggle pixel-corners inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold tracking-wider uppercase focus-visible:outline-2"
    >
      <span aria-hidden="true" className="text-base leading-none">
        {theme === 'light' ? '◐' : '◑'}
      </span>
      <span className="hidden sm:inline">
        {theme === 'light' ? 'PS1' : 'PS2'}
      </span>
    </button>
  );
}
