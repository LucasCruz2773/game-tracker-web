import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { isApiError } from '../../lib/api-client';
import {
  addToLibrary,
  fetchLibrary,
  fetchLibraryEntry,
  removeFromLibrary,
  updateLibraryEntry,
} from './library.api';
import type {
  LibraryEntry,
  LibraryEntryChanges,
  LibraryListParams,
} from './library.types';

export const libraryQueryKeys = {
  all: ['library'] as const,
  lists: () => [...libraryQueryKeys.all, 'list'] as const,
  list: (params: LibraryListParams) =>
    [...libraryQueryKeys.lists(), params] as const,
  entry: (gameId: string) =>
    [...libraryQueryKeys.all, 'entry', gameId] as const,
};

export function useLibrary(params: LibraryListParams) {
  return useQuery({
    queryKey: libraryQueryKeys.list(params),
    queryFn: ({ signal }) => fetchLibrary(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useLibraryEntry(gameId: string) {
  return useQuery({
    queryKey: libraryQueryKeys.entry(gameId),
    queryFn: ({ signal }) => fetchLibraryEntry(gameId, signal),
  });
}

function storeEntry(
  queryClient: QueryClient,
  gameId: string,
  entry: LibraryEntry | null,
) {
  queryClient.setQueryData(libraryQueryKeys.entry(gameId), entry);
  return queryClient.invalidateQueries({ queryKey: libraryQueryKeys.lists() });
}

export function useAddToLibrary(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (changes: LibraryEntryChanges) =>
      addToLibrary({ gameId, ...changes }),
    onSuccess: (entry) => storeEntry(queryClient, gameId, entry),
    onError: (error) => {
      // Already added elsewhere (another tab): show the existing entry instead.
      if (isApiError(error, 409)) {
        return queryClient.invalidateQueries({
          queryKey: libraryQueryKeys.entry(gameId),
        });
      }
    },
  });
}

export function useUpdateLibraryEntry(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (changes: LibraryEntryChanges) =>
      updateLibraryEntry(gameId, changes),
    onSuccess: (entry) => storeEntry(queryClient, gameId, entry),
  });
}

export function useRemoveFromLibrary(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => removeFromLibrary(gameId),
    onSuccess: () => storeEntry(queryClient, gameId, null),
  });
}
