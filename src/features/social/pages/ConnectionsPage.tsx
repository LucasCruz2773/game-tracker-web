import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { ApiError } from '../../../lib/api-client';
import { parsePageParam } from '../../../lib/search-params';
import { PlayerCard } from '../components/PlayerCard';
import type { SocialConnectionKind } from '../social.types';
import { useSocialConnections, useToggleFollow } from '../use-social';

const PAGE_SIZE = 12;

const COPY = {
  followers: {
    kicker: 'Network lobby // Incoming links',
    title: 'Seguidores',
    description: 'Jogadores que acompanham o seu perfil.',
    emptyTitle: 'Você ainda não tem seguidores',
    emptyDescription:
      'Quando outro jogador seguir você, ele aparecerá nesta lista.',
  },
  following: {
    kicker: 'Network lobby // Active links',
    title: 'Seguindo',
    description: 'Jogadores que você acompanha no GameTrack.',
    emptyTitle: 'Você ainda não segue ninguém',
    emptyDescription:
      'Encontre jogadores na área Jogadores para começar sua rede.',
  },
} as const;

interface ConnectionsPageProps {
  kind: SocialConnectionKind;
}

export function ConnectionsPage({ kind }: ConnectionsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePageParam(searchParams.get('page'));
  const connections = useSocialConnections(kind, {
    page,
    pageSize: PAGE_SIZE,
  });
  const toggleFollow = useToggleFollow();
  const copy = COPY[kind];

  return (
    <section className="space-y-6">
      <header>
        <p className="retro-kicker">{copy.kicker}</p>
        <h1 className="retro-title mt-1 text-2xl font-semibold">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-700">{copy.description}</p>
      </header>

      {connections.isPending || connections.isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center py-16">
          <Spinner label={`Carregando ${copy.title.toLowerCase()}…`} />
        </div>
      ) : connections.isError ? (
        <ErrorState
          title={`Não foi possível carregar ${copy.title.toLowerCase()}`}
          description={errorMessage(connections.error)}
          onRetry={() => void connections.refetch()}
        />
      ) : connections.data.items.length === 0 ? (
        <EmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
        />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {connections.data.items.map((user) => (
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
            page={connections.data.page}
            pageSize={connections.data.pageSize}
            total={connections.data.total}
            disabled={connections.isPlaceholderData}
            onPageChange={(nextPage) => {
              const nextParams = new URLSearchParams();
              if (nextPage > 1) nextParams.set('page', String(nextPage));
              setSearchParams(nextParams);
            }}
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
