import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { parsePageParam } from '../../../lib/search-params';
import { ActivityCard } from '../components/ActivityCard';
import { useActivityFeed } from '../use-activity-feed';

const PAGE_SIZE = 12;

export function ActivityFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePageParam(searchParams.get('page'));
  const feed = useActivityFeed({ page, pageSize: PAGE_SIZE });

  function setPage(nextPage: number) {
    const nextParams = new URLSearchParams();
    if (nextPage > 1) nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="retro-panel rounded-xl p-5 sm:p-6">
        <p className="retro-kicker">Network activity // Live saves</p>
        <h1 className="retro-title mt-1 text-2xl font-semibold">
          Feed de atividades
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Acompanhe jogos, conclusões, notas e reviews de quem você segue.
        </p>
      </header>

      {feed.isPending || feed.isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center py-16">
          <Spinner
            label={
              feed.isPlaceholderData
                ? 'Atualizando atividades…'
                : 'Carregando atividades…'
            }
          />
        </div>
      ) : feed.isError ? (
        <ErrorState
          title="Não foi possível carregar o feed"
          description="Verifique sua conexão e tente novamente."
          onRetry={() => void feed.refetch()}
        />
      ) : feed.data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma atividade por enquanto"
          description="Siga outros jogadores para acompanhar as novidades deles aqui."
        />
      ) : (
        <>
          <ol className="space-y-4">
            {feed.data.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ol>
          <Pagination
            page={feed.data.page}
            pageSize={feed.data.pageSize}
            total={feed.data.total}
            disabled={feed.isPlaceholderData}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
