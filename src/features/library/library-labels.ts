import type { LibrarySortField, LibraryStatus } from './library.types';

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  PLAYING: 'Jogando',
  BACKLOG: 'Na fila',
  COMPLETED: 'Concluído',
  DROPPED: 'Abandonado',
};

export const LIBRARY_STATUS_BADGE_CLASSES: Record<LibraryStatus, string> = {
  PLAYING: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  BACKLOG: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  COMPLETED: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  DROPPED: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
};

export const LIBRARY_SORT_LABELS: Record<LibrarySortField, string> = {
  updatedAt: 'Atualizados recentemente',
  createdAt: 'Adicionados recentemente',
  title: 'Título (A–Z)',
};
