import { useQuery } from '@tanstack/react-query';
import { fetchLibraryStats } from './dashboard.api';

export const dashboardStatsQueryKey = ['library', 'stats'] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardStatsQueryKey,
    queryFn: ({ signal }) => fetchLibraryStats(signal),
    staleTime: 60_000,
  });
}
