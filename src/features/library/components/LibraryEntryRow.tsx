import { useState } from 'react';
import { Link } from 'react-router';
import { GameCover } from '../../games/components/GameCover';
import { OptionalStarRating } from '../../reviews/components/OptionalStarRating';
import { reviewErrorMessage } from '../../reviews/review-errors';
import {
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from '../../reviews/use-reviews';
import { libraryErrorMessage } from '../library-errors';
import type { LibraryEntry, LibraryStatus } from '../library.types';
import { useUpdateLibraryEntry } from '../use-library';
import { LibraryStatusSelect } from './LibraryStatusSelect';

interface LibraryEntryRowProps {
  entry: LibraryEntry;
}

export function LibraryEntryRow({ entry }: LibraryEntryRowProps) {
  const { game } = entry;
  const updateEntry = useUpdateLibraryEntry(game.id);
  const createReview = useCreateReview(game.id);
  const updateReview = useUpdateReview(game.id, entry.review?.id ?? '');
  const deleteReview = useDeleteReview(game.id, entry.review?.id ?? '');
  const serverRating = entry.review?.rating ?? null;
  const [optimisticRating, setOptimisticRating] = useState<{
    base: number | null;
    value: number | null;
  } | null>(null);
  const displayedRating =
    optimisticRating?.base === serverRating
      ? optimisticRating.value
      : serverRating;
  const ratingPending =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;

  function changeStatus(status: LibraryStatus) {
    updateEntry.mutate({ status });
  }

  function changeRating(rating: number | null) {
    setOptimisticRating({ base: serverRating, value: rating });

    const finishOptimisticUpdate = () => setOptimisticRating(null);
    if (rating === null) {
      if (entry.review) {
        deleteReview.mutate(undefined, {
          onSuccess: finishOptimisticUpdate,
          onError: finishOptimisticUpdate,
        });
      }
    } else if (entry.review) {
      updateReview.mutate(
        { rating },
        {
          onSuccess: finishOptimisticUpdate,
          onError: finishOptimisticUpdate,
        },
      );
    } else {
      createReview.mutate(
        { rating },
        {
          onSuccess: finishOptimisticUpdate,
          onError: finishOptimisticUpdate,
        },
      );
    }
  }
  const ratingError =
    createReview.error ?? updateReview.error ?? deleteReview.error;

  const details = `${entry.hoursPlayed.toLocaleString('pt-BR')} h jogadas`;

  return (
    <li className="retro-panel retro-card flex h-full min-w-0 flex-col overflow-hidden rounded-xl">
      <Link
        to={`/games/${game.id}`}
        className="group block min-w-0 focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <GameCover
          title={game.title}
          coverUrl={game.coverUrl}
          className="aspect-video w-full border-b border-zinc-700/70 transition group-hover:opacity-90"
        />
        <div className="min-w-0 space-y-1 p-3">
          <h3 className="line-clamp-2 min-h-12 font-bold leading-snug tracking-wide uppercase">
            {game.title}
          </h3>
          <p className="text-xs tracking-wide text-zinc-700 uppercase">
            {details}
          </p>
          <div
            aria-hidden="true"
            className="memory-card-caption mt-2 flex items-center justify-between border px-2 py-1 text-[0.58rem] tracking-[0.14em] uppercase"
          >
            <span>Save data</span>
            <span>Slot A</span>
          </div>
        </div>
      </Link>

      <div className="mt-auto space-y-3 border-t border-zinc-600/70 bg-white/15 p-3">
        <div className="space-y-1">
          <p className="text-[0.65rem] tracking-wider text-zinc-700 uppercase">
            Status
          </p>
          <LibraryStatusSelect
            aria-label={`Status de ${game.title}`}
            value={
              (updateEntry.isPending && updateEntry.variables.status) ||
              entry.status
            }
            onChange={changeStatus}
            disabled={updateEntry.isPending}
          />
        </div>
        {updateEntry.isError && (
          <p role="alert" className="text-xs text-red-300">
            {libraryErrorMessage(updateEntry.error)}
          </p>
        )}
        <OptionalStarRating
          value={displayedRating}
          onChange={changeRating}
          disabled={ratingPending}
          label="Nota"
          ariaLabel={`Nota de ${game.title}`}
        />
        {ratingError && (
          <p role="alert" className="text-xs text-red-300">
            {reviewErrorMessage(ratingError)}
          </p>
        )}
      </div>
    </li>
  );
}
