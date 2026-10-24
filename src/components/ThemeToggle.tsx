import { useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'gametrack-theme';

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
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
      aria-label={`Ativar tema ${nextTheme === 'dark' ? 'escuro PS2' : 'claro PS1'}`}
      title={`Tema atual: ${theme === 'light' ? 'claro PS1' : 'escuro PS2'}`}
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
