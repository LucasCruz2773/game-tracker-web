import { Link } from 'react-router';
import { formatReviewDate } from '../../../lib/dates';
import { UserAvatar } from '../../auth/components/UserAvatar';
import { GameCover } from '../../games/components/GameCover';
import { StarRating } from '../../reviews/components/StarRating';
import type { Activity } from '../activity.types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <li className="retro-panel overflow-hidden rounded-xl">
      <article>
        <header className="flex items-center gap-3 border-b border-zinc-600/60 p-4">
          <Link
            to={`/players/${activity.actor.username}`}
            aria-label={`Abrir perfil de @${activity.actor.username}`}
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <UserAvatar user={activity.actor} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug">
              <Link
                to={`/players/${activity.actor.username}`}
                className="font-bold text-zinc-950 hover:text-brand-500"
              >
                @{activity.actor.username}
              </Link>{' '}
              {activityVerb(activity)}
            </p>
            <time
              dateTime={activity.createdAt}
              className="text-xs tracking-wide text-zinc-700 uppercase"
            >
              {formatReviewDate(activity.createdAt)}
            </time>
          </div>
          <span aria-hidden="true" className="text-2xl text-brand-500">
            {activitySymbol(activity.type)}
          </span>
        </header>

        <div className="grid gap-4 p-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <Link
            to={`/games/${activity.game.id}`}
            className="block focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <GameCover
              title={activity.game.title}
              coverUrl={activity.game.coverUrl}
              className="aspect-video w-full border border-zinc-600/70 object-cover sm:aspect-square"
            />
          </Link>
          <div className="min-w-0 space-y-3">
            <Link
              to={`/games/${activity.game.id}`}
              className="retro-title block text-lg font-bold hover:text-brand-500"
            >
              {activity.game.title}
            </Link>
            {activity.rating !== null && (
              <StarRating
                rating={activity.rating}
                label={activity.reviewBody ? 'Nota da review' : 'Nota'}
                ariaLabel={`Nota de ${activity.game.title}`}
              />
            )}
            {activity.reviewBody && (
              <blockquote className="border-l-4 border-brand-500 bg-black/10 px-4 py-3 text-sm leading-relaxed text-zinc-800">
                “{activity.reviewBody}”
              </blockquote>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

function activityVerb(activity: Activity): string {
  switch (activity.type) {
    case 'LIBRARY_ADDED':
      return 'adicionou um jogo à biblioteca';
    case 'GAME_COMPLETED':
      return 'concluiu um jogo';
    case 'REVIEWED':
      return activity.reviewBody ? 'publicou uma review' : 'deu uma nova nota';
  }
}

function activitySymbol(type: Activity['type']): string {
  switch (type) {
    case 'LIBRARY_ADDED':
      return '+';
    case 'GAME_COMPLETED':
      return '○';
    case 'REVIEWED':
      return '★';
  }
}
