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
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 transition hover:border-zinc-600 focus-visible:outline-2 focus-visible:outline-violet-500"
    >
      <GameCover
        title={game.title}
        coverUrl={game.coverUrl}
        className="aspect-video w-full transition group-hover:opacity-90"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-medium leading-snug">{game.title}</h3>
        <p className="text-xs text-zinc-500">
          {[game.releaseDate && isoDateYear(game.releaseDate), genres]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </Link>
  );
}
