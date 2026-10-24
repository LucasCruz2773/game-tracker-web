import { useState, type FormEvent } from 'react';
import { primaryButtonClasses } from '../../../components/form-classes';
import { libraryErrorMessage } from '../library-errors';
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
    addToLibrary.mutate({ status });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-zinc-700">
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
