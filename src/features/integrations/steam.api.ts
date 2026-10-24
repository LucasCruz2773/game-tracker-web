import { apiRequest, apiUrl } from '../../lib/api-client';
import type {
  SteamImportInput,
  SteamImportResult,
  SteamIntegrationStatus,
  SteamSyncResult,
} from './steam.types';

export const STEAM_CONNECT_URL = apiUrl('/integrations/steam/connect');

export function fetchSteamStatus(
  signal?: AbortSignal,
): Promise<SteamIntegrationStatus> {
  return apiRequest('/integrations/steam', { signal });
}

export function syncSteamLibrary(): Promise<SteamSyncResult> {
  return apiRequest('/integrations/steam/sync', { method: 'POST' });
}

export function importSteamGames(
  input: SteamImportInput,
): Promise<SteamImportResult> {
  return apiRequest('/integrations/steam/import', {
    method: 'POST',
    body: input,
  });
}

export function disconnectSteam(): Promise<void> {
  return apiRequest('/integrations/steam', { method: 'DELETE' });
}
