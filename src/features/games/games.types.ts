import type { IsoDate } from '../../lib/dates';

export interface GameTag {
  name: string;
  slug: string;
}

export interface GameSummary {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  releaseDate: IsoDate | null;
  genres: GameTag[];
  platforms: GameTag[];
}

export interface GameDetails extends GameSummary {
  description: string | null;
  averageRating: number | null;
  averageStarRating: number | null;
  reviewCount: number;
}

export interface GameSearchParams {
  search?: string;
  ordering: GameOrdering;
  direction: GameSortDirection;
  genre?: GameGenre;
  page: number;
  pageSize: number;
}

export const GAME_GENRES = [
  'action',
  'indie',
  'adventure',
  'role-playing-games-rpg',
  'strategy',
  'shooter',
  'casual',
  'simulation',
  'puzzle',
  'arcade',
  'platformer',
  'racing',
  'sports',
  'fighting',
  'massively-multiplayer',
  'family',
  'board-games',
  'educational',
  'card',
] as const;
export type GameGenre = (typeof GAME_GENRES)[number];

export function parseGameGenre(value: string | null): GameGenre | undefined {
  return GAME_GENRES.find((genre) => genre === value);
}

export const GAME_ORDERINGS = [
  'relevance',
  'popularity',
  'rating',
  'name',
  'released',
] as const;
export type GameOrdering = (typeof GAME_ORDERINGS)[number];
export type GameSortDirection = 'asc' | 'desc';

export function defaultGameSortDirection(
  ordering: GameOrdering,
): GameSortDirection {
  return ordering === 'name' ? 'asc' : 'desc';
}

export function parseGameSortDirection(
  value: string | null,
  ordering: GameOrdering,
): GameSortDirection {
  if (ordering === 'relevance') return 'desc';
  return value === 'asc' || value === 'desc'
    ? value
    : defaultGameSortDirection(ordering);
}

export function parseGameOrdering(value: string | null): GameOrdering {
  return GAME_ORDERINGS.find((ordering) => ordering === value) ?? 'relevance';
}
