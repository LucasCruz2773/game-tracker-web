import { useState } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { useAuthenticatedUser } from '../../auth/use-current-user';
import { useGameReviews, useMyReview } from '../use-reviews';
import { MyReviewForm } from './MyReviewForm';
import { ReviewCard } from './ReviewCard';

const PAGE_SIZE = 10;

interface ReviewsSectionProps {
  gameId: string;
}

export function ReviewsSection({ gameId }: ReviewsSectionProps) {
  const currentUser = useAuthenticatedUser();
  const [page, setPage] = useState(1);
  const {
    data: myReview,
    isPending: isMinePending,
    isError: isMineError,
    refetch: refetchMine,
  } = useMyReview(gameId);
  const {
    data: reviews,
    isPending: isListPending,
    isError: isListError,
    isPlaceholderData,
    refetch: refetchList,
  } = useGameReviews({ gameId, page, pageSize: PAGE_SIZE });

  const communityReviews =
    reviews?.items.filter((review) => review.author.id !== currentUser.id) ??
    [];
  const communityTotal = Math.max(
    0,
    (reviews?.total ?? 0) - (myReview ? 1 : 0),
  );

  return (
    <section aria-labelledby="reviews-title" className="space-y-6">
      <h2 id="reviews-title" className="text-xl font-semibold">
        Avaliações
      </h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h3 className="mb-4 font-medium">Sua avaliação</h3>
        {isMinePending ? (
          <Spinner label="Carregando sua avaliação…" />
        ) : isMineError ? (
          <ErrorState
            title="Não foi possível carregar sua avaliação"
            onRetry={() => void refetchMine()}
          />
        ) : (
          <MyReviewForm gameId={gameId} review={myReview} />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Da comunidade</h3>
        {isListPending ? (
          <div className="flex justify-center py-8">
            <Spinner label="Carregando avaliações…" />
          </div>
        ) : isListError ? (
          <ErrorState
            title="Não foi possível carregar as avaliações"
            onRetry={() => void refetchList()}
          />
        ) : communityReviews.length === 0 ? (
          <EmptyState
            title="Nenhuma outra avaliação ainda"
            description="Seja o primeiro a contar o que achou deste jogo."
          />
        ) : (
          <>
            <ul
              aria-busy={isPlaceholderData}
              className={`space-y-3 ${isPlaceholderData ? 'opacity-60' : ''}`}
            >
              {communityReviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
            {reviews && communityTotal > 0 && (
              <Pagination
                page={reviews.page}
                pageSize={reviews.pageSize}
                total={communityTotal}
                disabled={isPlaceholderData}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
