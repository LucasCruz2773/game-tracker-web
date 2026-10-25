import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { ApiError } from '../../../lib/api-client';
import { parsePageParam } from '../../../lib/search-params';
import { PlayerCard } from '../components/PlayerCard';
import { PlayerSearchForm } from '../components/PlayerSearchForm';
import { useSocialUsers, useToggleFollow } from '../use-social';

const PAGE_SIZE = 12;

export function PlayersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q')?.trim() ?? '';
  const page = parsePageParam(searchParams.get('page'));
  const users = useSocialUsers({
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const toggleFollow = useToggleFollow();

  function updateParams(nextSearch: string, nextPage: number) {
    const nextParams = new URLSearchParams();
    if (nextSearch) nextParams.set('q', nextSearch);
    if (nextPage > 1) nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="space-y-6">
      <header className="retro-panel rounded-xl p-5 sm:p-6">
        <p className="retro-kicker">Network lobby // Find players</p>
        <h1 className="retro-title mt-1 text-2xl font-semibold">Jogadores</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700">
          Encontre outros jogadores e acompanhe quem compartilha sua paixão por
          games.
        </p>
        <div className="mt-5 border-t border-zinc-600/50 pt-5">
          <PlayerSearchForm
            key={search}
            initialSearch={search}
            onSearch={(nextSearch) => updateParams(nextSearch, 1)}
          />
        </div>
      </header>

      {users.isPending || users.isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center py-16">
          <Spinner
            label={
              users.isPlaceholderData
                ? 'Atualizando jogadores…'
                : 'Buscando jogadores…'
            }
          />
        </div>
      ) : users.isError ? (
        <ErrorState
          title="Não foi possível carregar os jogadores"
          description={errorMessage(users.error)}
          onRetry={() => void users.refetch()}
        />
      ) : users.data.items.length === 0 ? (
        <EmptyState
          title="Nenhum jogador encontrado"
          description={
            search
              ? 'Tente buscar por outro nome de usuário.'
              : 'Outros jogadores aparecerão aqui quando entrarem no GameTrack.'
          }
        />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {users.data.items.map((user) => (
              <li key={user.id} className="flex">
                <PlayerCard
                  user={user}
                  isUpdating={
                    toggleFollow.isPending &&
                    toggleFollow.variables?.username === user.username
                  }
                  onToggleFollow={() =>
                    toggleFollow.mutate({
                      username: user.username,
                      currentlyFollowing: user.isFollowing,
                    })
                  }
                />
              </li>
            ))}
          </ul>
          {toggleFollow.isError && (
            <p role="alert" className="text-center text-sm text-red-500">
              {errorMessage(toggleFollow.error)}
            </p>
          )}
          <Pagination
            page={users.data.page}
            pageSize={users.data.pageSize}
            total={users.data.total}
            disabled={users.isPlaceholderData}
            onPageChange={(nextPage) => updateParams(search, nextPage)}
          />
        </>
      )}
    </section>
  );
}

function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.messages.join(' ')
    : 'Ocorreu um erro inesperado. Tente novamente.';
}
