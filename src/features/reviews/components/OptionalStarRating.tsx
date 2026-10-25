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
    <StarRating
      rating={value ?? 0}
      onChange={(rating) => onChange(rating === value ? null : rating)}
      disabled={disabled}
      label={label}
      ariaLabel={`${ariaLabel}. Selecione novamente a nota atual para zerar`}
    />
  );
}
