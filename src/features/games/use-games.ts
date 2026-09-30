import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchGame, searchGames } from './games.api';
import type { GameSearchParams } from './games.types';

export const gameQueryKeys = {
  search: (params: GameSearchParams) => ['games', 'search', params] as const,
  details: (gameId: string) => ['games', 'details', gameId] as const,
};

export function useGameSearch(params: GameSearchParams) {
  return useQuery({
    queryKey: gameQueryKeys.search(params),
    queryFn: ({ signal }) => searchGames(params, signal),
    // Keeps the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
}

export function useGame(gameId: string) {
  return useQuery({
    queryKey: gameQueryKeys.details(gameId),
    queryFn: ({ signal }) => fetchGame(gameId, signal),
    staleTime: 5 * 60_000,
  });
}
