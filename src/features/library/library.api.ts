import { apiRequest, isApiError } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type {
  AddToLibraryInput,
  LibraryEntry,
  LibraryEntryChanges,
  LibraryListParams,
} from './library.types';

export function fetchLibrary(
  { search, status, sortBy, page, pageSize }: LibraryListParams,
  signal?: AbortSignal,
): Promise<Paginated<LibraryEntry>> {
  const query = new URLSearchParams({
    sortBy,
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) {
    query.set('search', search);
  }
  if (status) {
    query.set('status', status);
  }
  return apiRequest(`/library?${query}`, { signal });
}

/** Resolves to `null` when the game is not in the user's library. */
export async function fetchLibraryEntry(
  gameId: string,
  signal?: AbortSignal,
): Promise<LibraryEntry | null> {
  try {
    return await apiRequest<LibraryEntry>(
      `/library/${encodeURIComponent(gameId)}`,
      { signal },
    );
  } catch (error) {
    if (isApiError(error, 404)) {
      return null;
    }
    throw error;
  }
}

export function addToLibrary(input: AddToLibraryInput): Promise<LibraryEntry> {
  return apiRequest('/library', { method: 'POST', body: input });
}

export function updateLibraryEntry(
  gameId: string,
  changes: LibraryEntryChanges,
): Promise<LibraryEntry> {
  return apiRequest(`/library/${encodeURIComponent(gameId)}`, {
    method: 'PATCH',
    body: changes,
  });
}

export function removeFromLibrary(gameId: string): Promise<void> {
  return apiRequest(`/library/${encodeURIComponent(gameId)}`, {
    method: 'DELETE',
  });
}
