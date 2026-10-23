import { Link } from 'react-router';
import { GameCover } from '../../games/components/GameCover';
import { libraryErrorMessage } from '../library-errors';
import type { LibraryEntry, LibraryStatus } from '../library.types';
import { useUpdateLibraryEntry } from '../use-library';
import { LibraryStatusSelect } from './LibraryStatusSelect';

interface LibraryEntryRowProps {
  entry: LibraryEntry;
}

export function LibraryEntryRow({ entry }: LibraryEntryRowProps) {
  const { game } = entry;
  const updateEntry = useUpdateLibraryEntry(game.id);

  function changeStatus(status: LibraryStatus) {
    updateEntry.mutate({ status });
  }

  const details = `${entry.hoursPlayed.toLocaleString('pt-BR')} h jogadas`;

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:flex-row sm:items-center">
      <Link
        to={`/games/${game.id}`}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-violet-500"
      >
        <GameCover
          title={game.title}
          coverUrl={game.coverUrl}
          className="aspect-video w-28 shrink-0 rounded-md"
        />
        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-medium">{game.title}</h3>
          <p className="text-xs text-zinc-500">{details}</p>
        </div>
      </Link>

      <div className="space-y-1 sm:w-44">
        <LibraryStatusSelect
          aria-label={`Status de ${game.title}`}
          value={
            (updateEntry.isPending && updateEntry.variables.status) ||
            entry.status
          }
          onChange={changeStatus}
          disabled={updateEntry.isPending}
        />
        {updateEntry.isError && (
          <p role="alert" className="text-xs text-red-300">
            {libraryErrorMessage(updateEntry.error)}
          </p>
        )}
      </div>
    </li>
  );
}
