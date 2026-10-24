import { StarRating } from './StarRating';

interface OptionalStarRatingProps {
  value: number | null;
  onChange: (rating: number | null) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
}

export function OptionalStarRating({
  value,
  onChange,
  disabled = false,
  label = 'Nota',
  ariaLabel = label,
}: OptionalStarRatingProps) {
  return (
    <div className="space-y-1">
      <StarRating
        rating={value ?? 0}
        onChange={(rating) => onChange(rating)}
        disabled={disabled}
        label={label}
        ariaLabel={ariaLabel}
      />
      {value !== null && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(null)}
          className="text-xs text-zinc-400 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-50"
        >
          Remover nota
        </button>
      )}
    </div>
  );
}
