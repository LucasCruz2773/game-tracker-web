import { useState, type FormEvent, type ReactNode } from 'react';
import {
  dangerButtonClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../components/form-classes';
import {
  isSameFormValues,
  toEntryChanges,
  toFormValues,
  validateFormValues,
  type LibraryEntryFormValues,
} from '../library-entry-form';
import { libraryErrorMessage } from '../library-errors';
import { MAX_HOURS_PLAYED, type LibraryEntry } from '../library.types';
import { useRemoveFromLibrary, useUpdateLibraryEntry } from '../use-library';
import { LibraryStatusSelect } from './LibraryStatusSelect';

interface LibraryEntryFormProps {
  entry: LibraryEntry;
}

export function LibraryEntryForm({ entry }: LibraryEntryFormProps) {
  const gameId = entry.game.id;
  const savedValues = toFormValues(entry);
  const [values, setValues] = useState<LibraryEntryFormValues>(savedValues);
  const [submitted, setSubmitted] = useState(false);
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const updateEntry = useUpdateLibraryEntry(gameId);
  const removeEntry = useRemoveFromLibrary(gameId);

  const errors = validateFormValues(values);
  const hasErrors = Object.keys(errors).length > 0;
  const isDirty = !isSameFormValues(values, savedValues);
  const isBusy = updateEntry.isPending || removeEntry.isPending;

  function updateHoursPlayed(value: string) {
    setValues({ ...values, hoursPlayed: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors || !isDirty) {
      return;
    }
    updateEntry.mutate(toEntryChanges(values));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="library-status">
          <LibraryStatusSelect
            id="library-status"
            value={values.status}
            disabled={isBusy}
            onChange={(status) => setValues({ ...values, status })}
          />
        </Field>

        <Field
          label="Horas jogadas"
          htmlFor="library-hours"
          error={submitted ? errors.hoursPlayed : undefined}
        >
          <input
            id="library-hours"
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_HOURS_PLAYED}
            step={1}
            value={values.hoursPlayed}
            disabled={isBusy}
            onChange={(event) => updateHoursPlayed(event.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className={primaryButtonClasses}
          disabled={isBusy || !isDirty}
        >
          {updateEntry.isPending ? 'Salvando…' : 'Salvar alterações'}
        </button>
        {isDirty && (
          <button
            type="button"
            className={secondaryButtonClasses}
            disabled={isBusy}
            onClick={() => {
              setValues(savedValues);
              setSubmitted(false);
            }}
          >
            Descartar
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {confirmingRemoval ? (
            <>
              <span className="text-sm text-zinc-700">
                Remover da biblioteca?
              </span>
              <button
                type="button"
                className={dangerButtonClasses}
                disabled={isBusy}
                onClick={() => removeEntry.mutate()}
              >
                {removeEntry.isPending ? 'Removendo…' : 'Sim, remover'}
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                disabled={isBusy}
                onClick={() => setConfirmingRemoval(false)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              className={dangerButtonClasses}
              disabled={isBusy}
              onClick={() => setConfirmingRemoval(true)}
            >
              Remover
            </button>
          )}
        </div>
      </div>

      <div aria-live="polite" className="text-sm">
        {updateEntry.isSuccess && !isDirty && (
          <p className="text-emerald-300">Alterações salvas.</p>
        )}
        {updateEntry.isError && (
          <p role="alert" className="text-red-300">
            {libraryErrorMessage(updateEntry.error)}
          </p>
        )}
        {removeEntry.isError && (
          <p role="alert" className="text-red-300">
            Não foi possível remover o jogo. Tente novamente.
          </p>
        )}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-800"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
