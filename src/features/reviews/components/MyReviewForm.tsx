import { useState, type FormEvent } from 'react';
import {
  dangerButtonClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../components/form-classes';
import { MAX_REVIEW_BODY_LENGTH } from '../rating';
import { reviewErrorMessage } from '../review-errors';
import type { Review } from '../reviews.types';
import {
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from '../use-reviews';
import { StarRating } from './StarRating';

interface MyReviewFormProps {
  gameId: string;
  review: Review | null;
}

export function MyReviewForm({ gameId, review }: MyReviewFormProps) {
  const [rating, setRating] = useState(review?.rating ?? 8);
  const [body, setBody] = useState(review?.body ?? '');
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const createReview = useCreateReview(gameId);
  const updateReview = useUpdateReview(gameId, review?.id ?? '');
  const deleteReview = useDeleteReview(gameId, review?.id ?? '');

  const isBusy =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;
  const isEditing = review !== null;
  const isDirty =
    isEditing && (rating !== review.rating || body !== (review.body ?? ''));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      rating,
      body: body.trim() === '' ? null : body.trim(),
    };
    const syncSavedReview = (savedReview: Review) => {
      setRating(savedReview.rating);
      setBody(savedReview.body ?? '');
      setConfirmingRemoval(false);
    };

    if (isEditing) {
      updateReview.mutate(payload, { onSuccess: syncSavedReview });
    } else {
      createReview.mutate(payload, { onSuccess: syncSavedReview });
    }
  }

  function handleDelete() {
    deleteReview.mutate(undefined, {
      onSuccess: () => {
        setRating(8);
        setBody('');
        setConfirmingRemoval(false);
      },
    });
  }

  const mutationError =
    createReview.error ?? updateReview.error ?? deleteReview.error;
  const showSavedMessage =
    (createReview.isSuccess || updateReview.isSuccess) && !isDirty;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarRating
        rating={rating}
        onChange={setRating}
        disabled={isBusy}
        label="Sua nota"
      />

      <div className="space-y-1.5">
        <label
          htmlFor="review-body"
          className="block text-sm font-medium text-zinc-300"
        >
          Sua avaliação
        </label>
        <textarea
          id="review-body"
          value={body}
          disabled={isBusy}
          maxLength={MAX_REVIEW_BODY_LENGTH}
          rows={4}
          placeholder="O que você achou? (opcional)"
          onChange={(event) => setBody(event.target.value)}
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className={primaryButtonClasses}
          disabled={isBusy || (isEditing && !isDirty)}
        >
          {isBusy
            ? 'Salvando…'
            : isEditing
              ? 'Salvar avaliação'
              : 'Publicar avaliação'}
        </button>

        {isEditing && (
          <div className="ml-auto flex items-center gap-2">
            {confirmingRemoval ? (
              <>
                <span className="text-sm text-zinc-400">
                  Excluir avaliação?
                </span>
                <button
                  type="button"
                  className={dangerButtonClasses}
                  disabled={isBusy}
                  onClick={handleDelete}
                >
                  {deleteReview.isPending ? 'Excluindo…' : 'Sim, excluir'}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClasses}
                  disabled={isBusy}
                  onClick={() => setConfirmingRemoval(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                className={dangerButtonClasses}
                disabled={isBusy}
                onClick={() => setConfirmingRemoval(true)}
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </div>

      <div aria-live="polite" className="text-sm">
        {showSavedMessage && (
          <p className="text-emerald-300">Avaliação salva.</p>
        )}
        {mutationError && (
          <p role="alert" className="text-red-300">
            {reviewErrorMessage(mutationError)}
          </p>
        )}
        {deleteReview.isError && (
          <p role="alert" className="text-red-300">
            Não foi possível excluir. Tente novamente.
          </p>
        )}
      </div>
    </form>
  );
}
