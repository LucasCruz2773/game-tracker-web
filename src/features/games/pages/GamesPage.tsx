import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { parsePageParam } from '../../../lib/search-params';
import { catalogErrorDescription } from '../catalog-errors';
import { GameCard } from '../components/GameCard';
import { GameSearchForm } from '../components/GameSearchForm';
import { useGameSearch } from '../use-games';

const PAGE_SIZE = 20;

export function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q')?.trim() ?? '';
  const page = parsePageParam(searchParams.get('page'));

  const { data, error, isPending, isError, isPlaceholderData, refetch } =
    useGameSearch({ search: search || undefined, page, pageSize: PAGE_SIZE });

  function updateParams(nextSearch: string, nextPage: number) {
    const nextParams = new URLSearchParams();
    if (nextSearch) nextParams.set('q', nextSearch);
    if (nextPage > 1) nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-semibold">
          {search ? `Resultados para “${search}”` : 'Jogos populares'}
        </h1>
        {/* The key resets the input when the URL changes (e.g. browser back). */}
        <GameSearchForm
          key={search}
          initialSearch={search}
          onSearch={(nextSearch) => updateParams(nextSearch, 1)}
        />
      </header>

      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner label="Buscando jogos…" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Não foi possível carregar os jogos"
          description={catalogErrorDescription(error)}
          onRetry={() => void refetch()}
        />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="Nenhum jogo encontrado"
          description="Tente buscar por outro nome."
        />
      ) : (
        <>
          <ul
            aria-busy={isPlaceholderData}
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${isPlaceholderData ? 'opacity-60' : ''}`}
          >
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
            disabled={isPlaceholderData}
            onPageChange={(nextPage) => updateParams(search, nextPage)}
          />
        </>
      )}
    </section>
  );
}
