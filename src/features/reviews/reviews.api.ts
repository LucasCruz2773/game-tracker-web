import { apiRequest, isApiError } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type { Review, ReviewInput } from './reviews.types';

export function fetchGameReviews(
  gameId: string,
  page: number,
  pageSize: number,
  signal?: AbortSignal,
): Promise<Paginated<Review>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest(`/games/${encodeURIComponent(gameId)}/reviews?${query}`, {
    signal,
  });
}

export async function fetchMyReview(
  gameId: string,
  signal?: AbortSignal,
): Promise<Review | null> {
  try {
    return await apiRequest<Review>(
      `/games/${encodeURIComponent(gameId)}/reviews/mine`,
      { signal },
    );
  } catch (error) {
    if (isApiError(error, 404)) {
      return null;
    }
    throw error;
  }
}

export function createReview(
  gameId: string,
  input: ReviewInput,
): Promise<Review> {
  return apiRequest(`/games/${encodeURIComponent(gameId)}/reviews`, {
    method: 'POST',
    body: input,
  });
}

export function updateReview(
  reviewId: string,
  input: ReviewInput,
): Promise<Review> {
  return apiRequest(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PATCH',
    body: input,
  });
}

export function deleteReview(reviewId: string): Promise<void> {
  return apiRequest(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'DELETE',
  });
}
