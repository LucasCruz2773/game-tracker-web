export interface ReviewAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  rating: number;
  starRating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthor;
}

export interface ReviewInput {
  rating: number;
  body?: string | null;
}

export interface ReviewListParams {
  gameId: string;
  page: number;
  pageSize: number;
}
