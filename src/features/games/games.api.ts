import { apiRequest } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import {
  defaultGameSortDirection,
  type GameDetails,
  type GameSearchParams,
  type GameSummary,
} from './games.types';

export function searchGames(
  { search, ordering, direction, genre, page, pageSize }: GameSearchParams,
  signal?: AbortSignal,
): Promise<Paginated<GameSummary>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) {
    query.set('search', search);
  }
  // Relevance is RAWG's default. Omitting it also keeps the default catalog
  // compatible while an API deployment is rolling from the previous version.
  if (ordering !== 'relevance') {
    query.set('ordering', ordering);
  }
  if (direction !== defaultGameSortDirection(ordering)) {
    query.set('direction', direction);
  }
  if (genre) {
    query.set('genre', genre);
  }
  return apiRequest(`/games?${query}`, { signal });
}

export function fetchGame(
  gameId: string,
  signal?: AbortSignal,
): Promise<GameDetails> {
  return apiRequest(`/games/${encodeURIComponent(gameId)}`, { signal });
}
