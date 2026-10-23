import {
  MAX_HOURS_PLAYED,
  type LibraryEntry,
  type LibraryEntryChanges,
  type LibraryStatus,
} from './library.types';

export interface LibraryEntryFormValues {
  status: LibraryStatus;
  hoursPlayed: string;
}

export type LibraryEntryFormErrors = Partial<Record<'hoursPlayed', string>>;

export function toFormValues(entry: LibraryEntry): LibraryEntryFormValues {
  return {
    status: entry.status,
    hoursPlayed: String(entry.hoursPlayed),
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

  return errors;
}

export function toEntryChanges(
  values: LibraryEntryFormValues,
): LibraryEntryChanges {
  return { status: values.status, hoursPlayed: Number(values.hoursPlayed) };
}

export function isSameFormValues(
  left: LibraryEntryFormValues,
  right: LibraryEntryFormValues,
): boolean {
  return (
    left.status === right.status &&
    Number(left.hoursPlayed) === Number(right.hoursPlayed)
  );
}
