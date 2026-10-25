import { Link } from 'react-router';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { ShareStoryButton } from '../../sharing/components/ShareStoryButton';
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
      className="retro-panel space-y-4 rounded-xl p-5"
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
          <ShareStoryButton entry={entry} />
          <Link
            to="/profile/library"
            className="inline-block text-sm font-bold tracking-wide text-brand-300 uppercase underline-offset-2 hover:underline"
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
