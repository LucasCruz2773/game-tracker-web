import { inputClasses } from '../../../components/form-classes';
import { LIBRARY_STATUS_LABELS } from '../library-labels';
import { LIBRARY_STATUSES, type LibraryStatus } from '../library.types';

interface LibraryStatusSelectProps {
  id?: string;
  value: LibraryStatus;
  onChange: (status: LibraryStatus) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function LibraryStatusSelect({
  id,
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: LibraryStatusSelectProps) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => {
        const status = LIBRARY_STATUSES.find(
          (option) => option === event.target.value,
        );
        if (status) onChange(status);
      }}
      className={inputClasses}
    >
      {LIBRARY_STATUSES.map((status) => (
        <option key={status} value={status}>
          {LIBRARY_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
