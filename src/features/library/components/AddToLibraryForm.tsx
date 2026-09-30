import { useState, type FormEvent } from 'react';
import { primaryButtonClasses } from '../../../components/form-classes';
import { todayIsoDate } from '../../../lib/dates';
import { libraryErrorMessage } from '../library-errors';
import { applyStatusChange } from '../library-progress';
import type { LibraryStatus } from '../library.types';
import { useAddToLibrary } from '../use-library';
import { LibraryStatusSelect } from './LibraryStatusSelect';

interface AddToLibraryFormProps {
  gameId: string;
}

export function AddToLibraryForm({ gameId }: AddToLibraryFormProps) {
  const [status, setStatus] = useState<LibraryStatus>('BACKLOG');
  const addToLibrary = useAddToLibrary(gameId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addToLibrary.mutate(applyStatusChange(null, status, todayIsoDate()));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-zinc-400">
        Este jogo ainda não está na sua biblioteca.
      </p>
      <div className="flex gap-2">
        <div className="flex-1">
          <LibraryStatusSelect
            aria-label="Status inicial"
            value={status}
            onChange={setStatus}
            disabled={addToLibrary.isPending}
          />
        </div>
        <button
          type="submit"
          className={primaryButtonClasses}
          disabled={addToLibrary.isPending}
        >
          {addToLibrary.isPending ? 'Adicionando…' : 'Adicionar'}
        </button>
      </div>
      {addToLibrary.isError && (
        <p role="alert" className="text-sm text-red-300">
          {libraryErrorMessage(addToLibrary.error)}
        </p>
      )}
    </form>
  );
}
