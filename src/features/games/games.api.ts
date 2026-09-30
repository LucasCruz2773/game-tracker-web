import { apiRequest } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type { GameDetails, GameSearchParams, GameSummary } from './games.types';

export function searchGames(
  { search, page, pageSize }: GameSearchParams,
  signal?: AbortSignal,
): Promise<Paginated<GameSummary>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) {
    query.set('search', search);
  }
  return apiRequest(`/games?${query}`, { signal });
}

export function fetchGame(
  gameId: string,
  signal?: AbortSignal,
): Promise<GameDetails> {
  return apiRequest(`/games/${encodeURIComponent(gameId)}`, { signal });
}
