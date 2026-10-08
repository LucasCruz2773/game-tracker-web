import { apiRequest } from '../../lib/api-client';
import type { LibraryStats } from './dashboard.types';

export function fetchLibraryStats(signal?: AbortSignal): Promise<LibraryStats> {
  return apiRequest('/library/stats', { signal });
}
