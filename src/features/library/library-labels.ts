import type { LibrarySortField, LibraryStatus } from './library.types';

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  UNSET: 'Sem status',
  PLAYING: 'Jogando',
  BACKLOG: 'Na fila',
  COMPLETED: 'Concluído',
  DROPPED: 'Abandonado',
};

export const LIBRARY_STATUS_BADGE_CLASSES: Record<LibraryStatus, string> = {
  UNSET: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  PLAYING: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  BACKLOG: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  COMPLETED: 'bg-brand-500/15 text-brand-300 ring-brand-500/30',
  DROPPED: 'bg-zinc-500/20 text-zinc-800 ring-zinc-500/40',
};

export const LIBRARY_SORT_LABELS: Record<LibrarySortField, string> = {
  updatedAt: 'Atualizados recentemente',
  createdAt: 'Adicionados recentemente',
  title: 'Título (A–Z)',
  rating: 'Maior nota',
};
