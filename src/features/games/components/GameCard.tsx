import { Link } from 'react-router';
import { isoDateYear } from '../../../lib/dates';
import type { GameSummary } from '../games.types';
import { GameCover } from './GameCover';

interface GameCardProps {
  game: GameSummary;
}

export function GameCard({ game }: GameCardProps) {
  const genres = game.genres
    .slice(0, 2)
    .map((genre) => genre.name)
    .join(', ');

  return (
    <Link
      to={`/games/${game.id}`}
      className="retro-panel retro-card group flex w-full flex-col overflow-hidden rounded-xl transition duration-200 hover:-translate-y-1 hover:border-brand-500 hover:shadow-[5px_6px_0_rgba(245,0,34,0.18)] focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <GameCover
        title={game.title}
        coverUrl={game.coverUrl}
        className="aspect-video w-full transition group-hover:opacity-90"
      />
      <div className="flex flex-1 flex-col gap-1 border-t border-zinc-700/70 p-3">
        <h3 className="line-clamp-2 font-bold leading-snug tracking-wide uppercase">
          {game.title}
        </h3>
        <p className="font-mono text-[0.68rem] text-zinc-700 uppercase">
          {[game.releaseDate && isoDateYear(game.releaseDate), genres]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <div
          aria-hidden="true"
          className="memory-card-caption mt-2 flex items-center justify-between border px-2 py-1 text-[0.58rem] tracking-[0.14em] uppercase"
        >
          <span>Memory card</span>
          <span>Slot A</span>
        </div>
      </div>
    </Link>
  );
}
