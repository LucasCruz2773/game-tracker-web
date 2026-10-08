import type { LibraryStatus } from '../library/library.types';

export interface LibraryStatusCounts {
  PLAYING: number;
  BACKLOG: number;
  COMPLETED: number;
  DROPPED: number;
}

export interface LibraryStats {
  totalGames: number;
  byStatus: LibraryStatusCounts;
  totalHoursPlayed: number;
  averageRating: number | null;
  averageStarRating: number | null;
}

export type DashboardStatusKey = LibraryStatus;
