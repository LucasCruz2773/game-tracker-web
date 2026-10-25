import { Link } from 'react-router';
import { GameCover } from '../../games/components/GameCover';
import { LibraryStatusBadge } from '../../library/components/LibraryStatusBadge';
import type { LibraryEntry } from '../../library/library.types';
import { StarRating } from '../../reviews/components/StarRating';

interface PublicLibraryCardProps {
  entry: LibraryEntry;
}

export function PublicLibraryCard({ entry }: PublicLibraryCardProps) {
  const { game } = entry;

  return (
    <li className="retro-panel retro-card flex h-full min-w-0 flex-col overflow-hidden rounded-xl">
      <Link
        to={`/games/${game.id}`}
        className="group block min-w-0 focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <GameCover
          title={game.title}
          coverUrl={game.coverUrl}
          className="aspect-video w-full border-b border-zinc-700/70 transition group-hover:opacity-90"
        />
        <div className="min-w-0 space-y-1 p-3">
          <h2 className="line-clamp-2 min-h-12 font-bold leading-snug tracking-wide uppercase">
            {game.title}
          </h2>
          <p className="text-xs tracking-wide text-zinc-700 uppercase">
            {entry.hoursPlayed.toLocaleString('pt-BR')} h jogadas
          </p>
          <div className="memory-card-caption mt-2 flex items-center justify-between border px-2 py-1 text-[0.58rem] tracking-[0.14em] uppercase">
            <span>Public save</span>
            <span>Read only</span>
          </div>
        </div>
      </Link>

      <div className="mt-auto space-y-3 border-t border-zinc-600/70 bg-white/15 p-3">
        <LibraryStatusBadge status={entry.status} />
        {entry.review ? (
          <StarRating
            rating={entry.review.rating}
            label="Nota"
            ariaLabel={`Nota de ${game.title}`}
          />
        ) : (
          <p className="text-xs text-zinc-700">Sem nota</p>
        )}
      </div>
    </li>
  );
}
