import {
  formatStarRating,
  MAX_REVIEW_RATING,
  MIN_REVIEW_RATING,
  toStarRating,
} from '../rating';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
  label?: string;
}

const STAR_COUNT = 5;

export function StarRating({
  rating,
  onChange,
  disabled = false,
  label = 'Nota',
}: StarRatingProps) {
  const starValue = toStarRating(rating);
  const interactive = onChange !== undefined && !disabled;

  function setFromStar(starIndex: number, half: boolean) {
    if (!onChange) {
      return;
    }
    const next = half ? starIndex * 2 - 1 : starIndex * 2;
    onChange(Math.min(MAX_REVIEW_RATING, Math.max(MIN_REVIEW_RATING, next)));
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-sm text-zinc-400">
          {formatStarRating(starValue)} / 5
        </span>
      </div>
      <div
        role={interactive ? 'radiogroup' : undefined}
        aria-label={label}
        className="inline-flex gap-0.5"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const starIndex = index + 1;
          const fill = Math.min(1, Math.max(0, starValue - starIndex + 1));

          return (
            <span key={starIndex} className="relative inline-block size-7">
              <span
                aria-hidden="true"
                className="absolute inset-0 text-zinc-700"
              >
                ★
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden text-amber-400"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
              {interactive && (
                <>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex * 2 - 1}
                    aria-label={`${formatStarRating(starIndex - 0.5)} estrelas`}
                    disabled={disabled}
                    onClick={() => setFromStar(starIndex, true)}
                    className="absolute inset-y-0 left-0 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
                  />
                  <button
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex * 2}
                    aria-label={`${formatStarRating(starIndex)} estrelas`}
                    disabled={disabled}
                    onClick={() => setFromStar(starIndex, false)}
                    className="absolute inset-y-0 right-0 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
                  />
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
