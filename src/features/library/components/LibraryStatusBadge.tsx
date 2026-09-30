import {
  LIBRARY_STATUS_BADGE_CLASSES,
  LIBRARY_STATUS_LABELS,
} from '../library-labels';
import type { LibraryStatus } from '../library.types';

interface LibraryStatusBadgeProps {
  status: LibraryStatus;
}

export function LibraryStatusBadge({ status }: LibraryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${LIBRARY_STATUS_BADGE_CLASSES[status]}`}
    >
      {LIBRARY_STATUS_LABELS[status]}
    </span>
  );
}
