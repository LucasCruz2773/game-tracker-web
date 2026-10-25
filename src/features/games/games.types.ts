import type { IsoDate } from '../../lib/dates';

export interface GameTag {
  name: string;
  slug: string;
}

export interface GameSummary {
  id: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  releaseDate: IsoDate | null;
  genres: GameTag[];
  platforms: GameTag[];
}

export interface GameDetails extends GameSummary {
  description: string | null;
  averageRating: number | null;
  averageStarRating: number | null;
  reviewCount: number;
}

export interface GameSearchParams {
  search?: string;
  page: number;
  pageSize: number;
}
