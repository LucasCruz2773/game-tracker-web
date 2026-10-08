import { formatReviewDate } from '../../../lib/dates';
import type { Review } from '../reviews.types';
import { ReviewAuthorHeader } from './ReviewAuthorHeader';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ReviewAuthorHeader author={review.author} />
        <time dateTime={review.createdAt} className="text-xs text-zinc-500">
          {formatReviewDate(review.createdAt)}
        </time>
      </div>
      <StarRating rating={review.rating} label="Nota do jogador" />
      {review.body && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
          {review.body}
        </p>
      )}
    </article>
  );
}
