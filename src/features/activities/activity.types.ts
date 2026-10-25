import type { GameSummary } from '../games/games.types';

export type ActivityType = 'LIBRARY_ADDED' | 'GAME_COMPLETED' | 'REVIEWED';

export interface ActivityActor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Activity {
  id: string;
  type: ActivityType;
  rating: number | null;
  starRating: number | null;
  reviewBody: string | null;
  createdAt: string;
  actor: ActivityActor;
  game: GameSummary;
}

export interface ActivityListParams {
  page: number;
  pageSize: number;
}
