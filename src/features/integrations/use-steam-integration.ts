import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardStatsQueryKey } from '../dashboard/use-dashboard-stats';
import { libraryQueryKeys } from '../library/use-library';
import {
  disconnectSteam,
  fetchSteamStatus,
  importSteamGames,
  syncSteamLibrary,
} from './steam.api';

export const steamStatusQueryKey = ['integrations', 'steam'] as const;

export function useSteamStatus() {
  return useQuery({
    queryKey: steamStatusQueryKey,
    queryFn: ({ signal }) => fetchSteamStatus(signal),
  });
}

export function useSyncSteamLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncSteamLibrary,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: steamStatusQueryKey }),
        queryClient.invalidateQueries({ queryKey: libraryQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardStatsQueryKey }),
      ]);
    },
  });
}

export function useImportSteamGames() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importSteamGames,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: libraryQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardStatsQueryKey }),
      ]);
    },
  });
}

export function useDisconnectSteam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectSteam,
    onSuccess: () => {
      queryClient.setQueryData(steamStatusQueryKey, {
        connected: false,
        account: null,
      });
    },
  });
}
