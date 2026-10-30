import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { useI18n } from '../../../i18n/i18n';
import { parsePageParam } from '../../../lib/search-params';
import { catalogErrorDescription } from '../catalog-errors';
import { GameCard } from '../components/GameCard';
import { GameGenreSelect } from '../components/GameGenreSelect';
import { GameOrderingSelect } from '../components/GameOrderingSelect';
import { GameSearchForm } from '../components/GameSearchForm';
import { GameSortDirectionButton } from '../components/GameSortDirectionButton';
import {
  defaultGameSortDirection,
  parseGameGenre,
  parseGameOrdering,
  parseGameSortDirection,
  type GameGenre,
  type GameOrdering,
  type GameSortDirection,
} from '../games.types';
import { useGameSearch } from '../use-games';

const PAGE_SIZE = 20;

export function GamesPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q')?.trim() ?? '';
  const ordering = parseGameOrdering(searchParams.get('ordering'));
  const direction = parseGameSortDirection(
    searchParams.get('direction'),
    ordering,
  );
  const genre = parseGameGenre(searchParams.get('genre'));
  const page = parsePageParam(searchParams.get('page'));

  const { data, error, isPending, isError, isPlaceholderData, refetch } =
    useGameSearch({
      search: search || undefined,
      ordering,
      direction,
      genre,
      page,
      pageSize: PAGE_SIZE,
    });

  function updateParams(
    nextSearch: string,
    nextPage: number,
    nextOrdering: GameOrdering = ordering,
    nextGenre: GameGenre | null | undefined = genre,
    nextDirection: GameSortDirection = direction,
  ) {
    const nextParams = new URLSearchParams();
    if (nextSearch) nextParams.set('q', nextSearch);
    if (nextOrdering !== 'relevance') {
      nextParams.set('ordering', nextOrdering);
    }
    if (nextGenre) nextParams.set('genre', nextGenre);
    if (nextDirection !== defaultGameSortDirection(nextOrdering)) {
      nextParams.set('direction', nextDirection);
    }
    if (nextPage > 1) nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="space-y-6">
      <header className="retro-panel retro-screen overflow-hidden rounded-xl">
        <div className="grid min-h-64 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="retro-kicker">Game database // Select title</p>
            <h1 className="retro-title mt-3 max-w-xl text-3xl leading-tight font-black sm:text-4xl">
              {search ? t('resultsFor', { search }) : t('journey')}
            </h1>
            {!search && (
              <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-300">
                {t('journeyDescription')}
              </p>
            )}
          </div>

          <div
            aria-hidden="true"
            className="retro-grid relative hidden overflow-hidden border-l border-zinc-600/70 bg-[radial-gradient(circle_at_center,#363b50_0%,#121520_68%)] md:block"
          >
            <img
              src="/gametrack-logo.svg"
              alt=""
              className="absolute top-1/2 left-1/2 w-44 -translate-x-1/2 -translate-y-1/2 drop-shadow-[12px_12px_0_rgba(0,0,0,0.55)] lg:w-52"
            />
            <span className="absolute top-5 left-6 text-5xl text-emerald-400/60">
              △
            </span>
            <span className="absolute top-8 right-8 text-5xl text-brand-500/70">
              ○
            </span>
            <span className="absolute right-10 bottom-5 text-5xl text-blue-400/60">
              ×
            </span>
            <span className="absolute bottom-8 left-8 text-5xl text-fuchsia-400/60">
              □
            </span>
            <p className="absolute right-0 bottom-0 left-0 bg-black/50 py-2 text-center text-xs tracking-[0.25em] text-zinc-300 uppercase">
              Press start
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-600/70 bg-zinc-800/70 p-4 sm:p-5">
          {/* The key resets the input when the URL changes (e.g. browser back). */}
          <GameSearchForm
            key={search}
            initialSearch={search}
            onSearch={(nextSearch) => updateParams(nextSearch, 1)}
          />
          <div className="mt-3 flex flex-col justify-end gap-3 sm:flex-row">
            <GameGenreSelect
              value={genre}
              onChange={(nextGenre) =>
                updateParams(search, 1, ordering, nextGenre ?? null)
              }
            />
            <GameOrderingSelect
              value={ordering}
              onChange={(nextOrdering) =>
                updateParams(
                  search,
                  1,
                  nextOrdering,
                  genre,
                  defaultGameSortDirection(nextOrdering),
                )
              }
            />
            <GameSortDirectionButton
              ordering={ordering}
              direction={direction}
              onChange={(nextDirection) =>
                updateParams(search, 1, ordering, genre, nextDirection)
              }
            />
          </div>
        </div>
      </header>

      {isPending || isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center py-16">
          <Spinner
            label={isPlaceholderData ? t('updatingGames') : t('searchingGames')}
          />
        </div>
      ) : isError ? (
        <ErrorState
          title={t('gamesLoadError')}
          description={catalogErrorDescription(error)}
          onRetry={() => void refetch()}
        />
      ) : data.items.length === 0 ? (
        <EmptyState title={t('noGames')} description={t('tryAnotherName')} />
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {data.items.map((game) => (
              <li key={game.id} className="flex">
                <GameCard game={game} />
              </li>
            ))}
          </ul>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={(nextPage) => updateParams(search, nextPage)}
          />
        </>
      )}
    </section>
  );
}
