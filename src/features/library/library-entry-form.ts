import type { IsoDate } from '../../lib/dates';
import { applyStatusChange, validateLibraryProgress } from './library-progress';
import {
  MAX_HOURS_PLAYED,
  type LibraryEntry,
  type LibraryEntryChanges,
  type LibraryProgress,
  type LibraryStatus,
} from './library.types';

/** Form inputs hold strings; an empty date means "not set". */
export interface LibraryEntryFormValues {
  status: LibraryStatus;
  hoursPlayed: string;
  startedAt: string;
  completedAt: string;
}

export type LibraryEntryFormErrors = Partial<
  Record<'hoursPlayed' | 'completedAt', string>
>;

export function toFormValues(entry: LibraryEntry): LibraryEntryFormValues {
  return {
    status: entry.status,
    hoursPlayed: String(entry.hoursPlayed),
    startedAt: entry.startedAt ?? '',
    completedAt: entry.completedAt ?? '',
  };
}

function toProgress(values: LibraryEntryFormValues): LibraryProgress {
  return {
    status: values.status,
    startedAt: values.startedAt || null,
    completedAt: values.completedAt || null,
  };
}

export function changeFormStatus(
  values: LibraryEntryFormValues,
  status: LibraryStatus,
  today: IsoDate,
): LibraryEntryFormValues {
  const progress = applyStatusChange(toProgress(values), status, today);
  return {
    ...values,
    status,
    startedAt: progress.startedAt ?? '',
    completedAt: progress.completedAt ?? '',
  };
}

export function validateFormValues(
  values: LibraryEntryFormValues,
): LibraryEntryFormErrors {
  const errors: LibraryEntryFormErrors = {};
  const hoursPlayed = Number(values.hoursPlayed);

  if (
    values.hoursPlayed.trim() === '' ||
    !Number.isInteger(hoursPlayed) ||
    hoursPlayed < 0 ||
    hoursPlayed > MAX_HOURS_PLAYED
  ) {
    errors.hoursPlayed = `Informe um número inteiro de 0 a ${MAX_HOURS_PLAYED.toLocaleString('pt-BR')}.`;
  }

  const progressError = validateLibraryProgress(toProgress(values));
  if (progressError === 'completed_before_started') {
    errors.completedAt = 'A conclusão não pode ser antes do início.';
  } else if (progressError === 'completed_without_status') {
    errors.completedAt = 'Só jogos concluídos têm data de conclusão.';
  }

  return errors;
}

export function toEntryChanges(
  values: LibraryEntryFormValues,
): LibraryEntryChanges {
  return { ...toProgress(values), hoursPlayed: Number(values.hoursPlayed) };
}

export function isSameFormValues(
  left: LibraryEntryFormValues,
  right: LibraryEntryFormValues,
): boolean {
  return (
    left.status === right.status &&
    Number(left.hoursPlayed) === Number(right.hoursPlayed) &&
    left.startedAt === right.startedAt &&
    left.completedAt === right.completedAt
  );
}
