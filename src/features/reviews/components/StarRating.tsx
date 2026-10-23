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

/** 0 = empty, 0.5 = half, 1 = full */
function starFill(starValue: number, starIndex: number): number {
  return Math.min(1, Math.max(0, starValue - starIndex + 1));
}

function StarPath({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-7 ${className}`}
      fill="currentColor"
    >
      <path d="M12 2l2.9 6.26 6.8.59-5.15 4.46 1.55 6.64L12 17.27 5.9 20.95l1.55-6.64L2.3 8.85l6.8-.59L12 2z" />
    </svg>
  );
}

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
          const fill = starFill(starValue, starIndex);

          return (
            <span key={starIndex} className="relative inline-block size-7">
              <StarPath className="text-zinc-700" />
              {fill > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-amber-400"
                  style={
                    fill < 1
                      ? { clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }
                      : undefined
                  }
                >
                  <StarPath />
                </span>
              )}
              {interactive && (
                <>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex * 2 - 1}
                    aria-label={`${formatStarRating(starIndex - 0.5)} estrelas`}
                    disabled={disabled}
                    onClick={() => setFromStar(starIndex, true)}
                    className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
                  />
                  <button
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex * 2}
                    aria-label={`${formatStarRating(starIndex)} estrelas`}
                    disabled={disabled}
                    onClick={() => setFromStar(starIndex, false)}
                    className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500"
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
