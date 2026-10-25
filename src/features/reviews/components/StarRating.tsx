import { useState } from 'react';
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
  ariaLabel?: string;
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
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`size-5 ${className}`}
      fill="currentColor"
    >
      <path d="M6 0h4v4h6v4h-4v2h2v6l-6-4-6 4v-6h2V8H0V4h6V0Z" />
    </svg>
  );
}

export function StarRating({
  rating,
  onChange,
  disabled = false,
  label = 'Nota',
  ariaLabel = label,
}: StarRatingProps) {
  const interactive = onChange !== undefined && !disabled;
  const [previewRating, setPreviewRating] = useState<number | null>(null);
  const displayedRating = previewRating ?? rating;
  const starValue = toStarRating(displayedRating);

  function setFromStar(starIndex: number, half: boolean) {
    if (!onChange) {
      return;
    }
    const next = half ? starIndex * 2 - 1 : starIndex * 2;
    onChange(Math.min(MAX_REVIEW_RATING, Math.max(MIN_REVIEW_RATING, next)));
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-wider text-zinc-800 uppercase">
          {label}
        </span>
        <span className="border border-zinc-600 bg-white/25 px-1.5 py-0.5 text-xs text-zinc-800 tabular-nums">
          {formatStarRating(starValue)} / 5
        </span>
      </div>
      <div
        role={interactive ? 'radiogroup' : undefined}
        aria-label={ariaLabel}
        className="inline-flex gap-1"
        onMouseLeave={() => setPreviewRating(null)}
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const starIndex = index + 1;
          const fill = starFill(starValue, starIndex);

          return (
            <span
              key={starIndex}
              className={`retro-rating-star relative grid size-8 place-items-center border bg-zinc-700/25 shadow-[2px_2px_0_rgba(70,70,76,0.5)] ${
                fill > 0 ? 'border-amber-500/60' : 'border-zinc-700'
              }`}
            >
              <StarPath className="text-zinc-700" />
              {fill > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center text-amber-300 drop-shadow-[1px_1px_0_#92400e]"
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
                    onMouseEnter={() => setPreviewRating(starIndex * 2 - 1)}
                    onClick={() => setFromStar(starIndex, true)}
                    className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-500"
                  />
                  <button
                    type="button"
                    role="radio"
                    aria-checked={rating === starIndex * 2}
                    aria-label={`${formatStarRating(starIndex)} estrelas`}
                    disabled={disabled}
                    onMouseEnter={() => setPreviewRating(starIndex * 2)}
                    onClick={() => setFromStar(starIndex, false)}
                    className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-500"
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
