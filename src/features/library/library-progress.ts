import type { IsoDate } from '../../lib/dates';
import type { LibraryProgress, LibraryStatus } from './library.types';

/**
 * Mirrors the API defaults for dates when the status changes, but with the
 * user's local "today" (the API falls back to the UTC date):
 * - PLAYING fills an empty `startedAt`;
 * - COMPLETED fills an empty `completedAt`;
 * - any other status has no `completedAt`.
 */
export function applyStatusChange(
  current: LibraryProgress | null,
  status: LibraryStatus,
  today: IsoDate,
): LibraryProgress {
  let startedAt = current?.startedAt ?? null;
  let completedAt = current?.completedAt ?? null;

  if (status === 'PLAYING' && startedAt === null) {
    startedAt = today;
  }

  if (status === 'COMPLETED') {
    completedAt ??= today;
  } else {
    completedAt = null;
  }

  return { status, startedAt, completedAt };
}

export type LibraryProgressError =
  'completed_before_started' | 'completed_without_status';

export function validateLibraryProgress({
  status,
  startedAt,
  completedAt,
}: LibraryProgress): LibraryProgressError | null {
  if (completedAt !== null && status !== 'COMPLETED') {
    return 'completed_without_status';
  }
  // ISO dates compare correctly as strings.
  if (startedAt !== null && completedAt !== null && completedAt < startedAt) {
    return 'completed_before_started';
  }
  return null;
}
