import { Link, useParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { isApiError } from '../../../lib/api-client';
import { formatIsoDate } from '../../../lib/dates';
import { LibraryPanel } from '../../library/components/LibraryPanel';
import { ReviewsSection } from '../../reviews/components/ReviewsSection';
import { catalogErrorDescription } from '../catalog-errors';
import { GameCover } from '../components/GameCover';
import type { GameDetails, GameTag } from '../games.types';
import { useGame } from '../use-games';

export function GameDetailsPage() {
  const { gameId = '' } = useParams();
  const { data: game, error, isPending, isError, refetch } = useGame(gameId);

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Carregando jogo…" />
      </div>
    );
  }

  if (isError) {
    // 400 comes back for ids that aren't UUIDs.
    if (isApiError(error, 404) || isApiError(error, 400)) {
      return (
        <EmptyState
          title="Jogo não encontrado"
          description="Ele pode ter sido removido ou o link está incorreto."
          action={
            <Link to="/" className="text-sm text-violet-300 hover:underline">
              Explorar jogos
            </Link>
          }
        />
      );
    }
    return (
      <ErrorState
        title="Não foi possível carregar o jogo"
        description={catalogErrorDescription(error)}
        onRetry={() => void refetch()}
      />
    );
  }

  return <GameDetailsView game={game} />;
}

function GameDetailsView({ game }: { game: GameDetails }) {
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
            <h1 className="text-3xl font-semibold">{game.title}</h1>
            {game.releaseDate && (
              <p className="text-sm text-zinc-400">
                Lançamento: {formatIsoDate(game.releaseDate)}
              </p>
            )}
          </header>

          <TagList label="Gêneros" tags={game.genres} />
          <TagList label="Plataformas" tags={game.platforms} />

          <section className="space-y-2">
            <h2 className="font-semibold">Sobre</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
              {game.description || 'Sem descrição disponível.'}
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
      <h2 className="text-sm font-medium text-zinc-400">{label}</h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag.slug}
            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
