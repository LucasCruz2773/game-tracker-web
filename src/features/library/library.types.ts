import type { IsoDate } from '../../lib/dates';
import type { GameSummary } from '../games/games.types';

export const LIBRARY_STATUSES = [
  'PLAYING',
  'BACKLOG',
  'COMPLETED',
  'DROPPED',
] as const;
export type LibraryStatus = (typeof LIBRARY_STATUSES)[number];

export const LIBRARY_SORT_FIELDS = ['updatedAt', 'createdAt', 'title'] as const;
export type LibrarySortField = (typeof LIBRARY_SORT_FIELDS)[number];

export const MAX_HOURS_PLAYED = 100_000;

export interface LibraryProgress {
  status: LibraryStatus;
  startedAt: IsoDate | null;
  completedAt: IsoDate | null;
}

export interface LibraryEntry extends LibraryProgress {
  id: string;
  hoursPlayed: number;
  createdAt: string;
  updatedAt: string;
  game: GameSummary;
}

export interface LibraryEntryChanges {
  status?: LibraryStatus;
  hoursPlayed?: number;
  startedAt?: IsoDate | null;
  completedAt?: IsoDate | null;
}

export interface AddToLibraryInput extends LibraryEntryChanges {
  gameId: string;
}

export interface LibraryListParams {
  status?: LibraryStatus;
  sortBy: LibrarySortField;
  page: number;
  pageSize: number;
}
