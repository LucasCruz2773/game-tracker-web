import type { LibraryStatus } from '../library/library.types';

export interface SteamAccount {
  steamId: string;
  personaName: string;
  avatarUrl: string | null;
  lastSyncedAt: string | null;
}

export interface SteamIntegrationStatus {
  connected: boolean;
  account: SteamAccount | null;
}

export interface SteamLibraryItem {
  appId: number;
  name: string;
  playtimeMinutes: number;
  imported: boolean;
}

export interface SteamSyncResult {
  items: SteamLibraryItem[];
  totalOwned: number;
  totalPlayed: number;
  updatedLibraryEntries: number;
}

export interface SteamImportResult {
  imported: number;
  updated: number;
  unmatchedAppIds: number[];
}

export interface SteamImportInput {
  games: SteamImportSelection[];
}

export interface SteamImportSelection {
  appId: number;
  status: LibraryStatus;
  rating?: number;
}
