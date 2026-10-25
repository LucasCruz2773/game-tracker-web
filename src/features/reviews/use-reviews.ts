import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { isApiError } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import { gameQueryKeys } from '../games/use-games';
import type { LibraryEntry } from '../library/library.types';
import { libraryQueryKeys } from '../library/use-library';
import {
  createReview,
  deleteReview,
  fetchGameReviews,
  fetchMyReview,
  updateReview,
} from './reviews.api';
import type { Review, ReviewInput, ReviewListParams } from './reviews.types';

export const reviewQueryKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewQueryKeys.all, 'list'] as const,
  list: (params: ReviewListParams) =>
    [...reviewQueryKeys.lists(), params] as const,
  mine: (gameId: string) => [...reviewQueryKeys.all, 'mine', gameId] as const,
};

export function useGameReviews(params: ReviewListParams) {
  return useQuery({
    queryKey: reviewQueryKeys.list(params),
    queryFn: ({ signal }) =>
      fetchGameReviews(params.gameId, params.page, params.pageSize, signal),
    placeholderData: keepPreviousData,
  });
}

export function useMyReview(gameId: string) {
  return useQuery({
    queryKey: reviewQueryKeys.mine(gameId),
    queryFn: ({ signal }) => fetchMyReview(gameId, signal),
  });
}

function refreshReviewQueries(
  queryClient: QueryClient,
  gameId: string,
  review: Review | null,
): void {
  queryClient.setQueryData(reviewQueryKeys.mine(gameId), review);
  const libraryReview = review
    ? {
        id: review.id,
        rating: review.rating,
        starRating: review.starRating,
      }
    : null;

  queryClient.setQueriesData<Paginated<LibraryEntry>>(
    { queryKey: libraryQueryKeys.lists() },
    (current) =>
      current && {
        ...current,
        items: current.items.map((entry) =>
          entry.game.id === gameId
            ? { ...entry, review: libraryReview }
            : entry,
        ),
      },
  );
  queryClient.setQueryData<LibraryEntry | null>(
    libraryQueryKeys.entry(gameId),
    (current) => (current ? { ...current, review: libraryReview } : current),
  );
  void queryClient.invalidateQueries({ queryKey: libraryQueryKeys.all });
  void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.lists() });
  void queryClient.invalidateQueries({
    queryKey: gameQueryKeys.details(gameId),
  });
}

export function useCreateReview(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewInput) => createReview(gameId, input),
    onSuccess: (review) => {
      refreshReviewQueries(queryClient, gameId, review);
    },
    onError: (error) => {
      if (isApiError(error, 409)) {
        void queryClient.invalidateQueries({
          queryKey: reviewQueryKeys.mine(gameId),
        });
      }
    },
  });
}

export function useUpdateReview(gameId: string, reviewId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewInput) => updateReview(reviewId, input),
    onSuccess: (review) => {
      refreshReviewQueries(queryClient, gameId, review);
    },
  });
}

export function useDeleteReview(gameId: string, reviewId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteReview(reviewId),
    onSuccess: () => {
      refreshReviewQueries(queryClient, gameId, null);
    },
  });
}
