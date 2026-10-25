import { Link, useParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { useI18n } from '../../../i18n/i18n';
import { isApiError } from '../../../lib/api-client';
import { formatIsoDate } from '../../../lib/dates';
import { LibraryPanel } from '../../library/components/LibraryPanel';
import { ReviewsSection } from '../../reviews/components/ReviewsSection';
import { StarRating } from '../../reviews/components/StarRating';
import { catalogErrorDescription } from '../catalog-errors';
import { GameCover } from '../components/GameCover';
import type { GameDetails, GameTag } from '../games.types';
import { useGame } from '../use-games';

export function GameDetailsPage() {
  const { t } = useI18n();
  const { gameId = '' } = useParams();
  const { data: game, error, isPending, isError, refetch } = useGame(gameId);

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label={t('gameLoading')} />
      </div>
    );
  }

  if (isError) {
    // 400 comes back for ids that aren't UUIDs.
    if (isApiError(error, 404) || isApiError(error, 400)) {
      return (
        <EmptyState
          title={t('gameNotFound')}
          description={t('gameNotFoundDescription')}
          action={
            <Link to="/" className="text-sm text-brand-300 hover:underline">
              Explorar jogos
            </Link>
          }
        />
      );
    }
    return (
      <ErrorState
        title={t('gameLoadError')}
        description={catalogErrorDescription(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  return <GameDetailsView game={game} />;
}

function GameDetailsView({ game }: { game: GameDetails }) {
  const { t } = useI18n();
  return (
    <article className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <GameCover
            title={game.title}
            coverUrl={game.coverUrl}
            className="aspect-video w-full rounded-xl"
          />
          <header className="space-y-2">
            <p className="retro-kicker">Game data // Detail view</p>
            <h1 className="retro-title text-3xl font-semibold">{game.title}</h1>
            {game.releaseDate && (
              <p className="text-sm text-zinc-700">
                {t('release')}: {formatIsoDate(game.releaseDate)}
              </p>
            )}
            {game.averageRating === null ? (
              <p className="text-sm text-zinc-700">{t('noReviews')}</p>
            ) : (
              <div className="pt-2">
                <StarRating
                  rating={game.averageRating}
                  label={t('averageRating')}
                  ariaLabel={t('averageAria', {
                    stars: game.averageStarRating ?? 0,
                    count: game.reviewCount,
                  })}
                />
                <p className="mt-1 text-xs text-zinc-700">
                  {game.reviewCount}{' '}
                  {t(game.reviewCount === 1 ? 'oneReview' : 'manyReviews')}
                </p>
              </div>
            )}
          </header>

          <TagList label={t('genres')} tags={game.genres} />
          <TagList label={t('platforms')} tags={game.platforms} />

          <section className="space-y-2">
            <h2 className="font-semibold">{t('about')}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-800">
              {game.description || t('noDescription')}
            </p>
          </section>

          <ReviewsSection gameId={game.id} />
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <LibraryPanel gameId={game.id} />
        </aside>
      </div>
    </article>
  );
}

function TagList({ label, tags }: { label: string; tags: GameTag[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-zinc-700">{label}</h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag.slug}
            className="border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[0.68rem] tracking-wide text-zinc-200 uppercase"
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
