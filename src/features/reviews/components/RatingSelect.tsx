import { inputClasses } from '../../../components/form-classes';
import {
  formatStarRating,
  MAX_REVIEW_RATING,
  MIN_REVIEW_RATING,
  toStarRating,
} from '../rating';

interface RatingSelectProps {
  value: number | null;
  onChange: (rating: number | null) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const RATINGS = Array.from(
  { length: MAX_REVIEW_RATING - MIN_REVIEW_RATING + 1 },
  (_, index) => MAX_REVIEW_RATING - index,
);

export function RatingSelect({
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel = 'Nota',
}: RatingSelectProps) {
  return (
    <select
      value={value ?? ''}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => {
        const rating = Number(event.target.value);
        onChange(event.target.value === '' ? null : rating);
      }}
      className={inputClasses}
    >
      <option value="">Sem nota</option>
      {RATINGS.map((rating) => (
        <option key={rating} value={rating}>
          {formatStarRating(toStarRating(rating))} estrelas
        </option>
      ))}
    </select>
  );
}
