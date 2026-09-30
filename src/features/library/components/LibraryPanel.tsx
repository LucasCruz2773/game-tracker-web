import { Link } from 'react-router';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { useLibraryEntry } from '../use-library';
import { AddToLibraryForm } from './AddToLibraryForm';
import { LibraryEntryForm } from './LibraryEntryForm';
import { LibraryStatusBadge } from './LibraryStatusBadge';

interface LibraryPanelProps {
  gameId: string;
}

export function LibraryPanel({ gameId }: LibraryPanelProps) {
  const { data: entry, isPending, isError, refetch } = useLibraryEntry(gameId);

  return (
    <section
      aria-labelledby="library-panel-title"
      className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="library-panel-title" className="font-semibold">
          Minha biblioteca
        </h2>
        {entry && <LibraryStatusBadge status={entry.status} />}
      </div>

      {isPending ? (
        <Spinner />
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar sua biblioteca"
          onRetry={() => void refetch()}
        />
      ) : entry ? (
        <>
          <LibraryEntryForm key={entry.id} entry={entry} />
          <Link
            to="/library"
            className="inline-block text-sm text-violet-300 underline-offset-2 hover:underline"
          >
            Ver minha biblioteca
          </Link>
        </>
      ) : (
        <AddToLibraryForm gameId={gameId} />
      )}
    </section>
  );
}
