import { useParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import { StatCard } from '../../dashboard/components/StatCard';
import {
  LIBRARY_STATUS_BADGE_CLASSES,
  LIBRARY_STATUS_LABELS,
} from '../../library/library-labels';
import { LIBRARY_STATUSES } from '../../library/library.types';
import { formatStarRating } from '../../reviews/rating';
import { usePublicSummary } from '../use-social';

export function PublicSummaryPage() {
  const { username = '' } = useParams();
  const summary = usePublicSummary(username);

  if (summary.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Carregando resumo…" />
      </div>
    );
  }

  if (summary.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar este resumo"
        description="Verifique sua conexão e tente novamente."
        onRetry={() => void summary.refetch()}
      />
    );
  }

  const stats = summary.data;
  if (stats.totalGames === 0) {
    return (
      <section className="space-y-6">
        <SummaryHeader username={username} />
        <EmptyState
          title="Nada para resumir ainda"
          description="Este jogador ainda não adicionou jogos à biblioteca."
        />
      </section>
    );
  }

  const averageStars =
    stats.averageStarRating === null
      ? '—'
      : `${formatStarRating(stats.averageStarRating)} / 5`;

  return (
    <section className="space-y-8">
      <SummaryHeader username={username} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total de jogos"
          value={stats.totalGames.toLocaleString('pt-BR')}
        />
        <StatCard
          label="Horas jogadas"
          value={stats.totalHoursPlayed.toLocaleString('pt-BR')}
          hint="Soma de toda a biblioteca"
        />
        <StatCard
          label="Nota"
          value={averageStars}
          hint="Das avaliações deste jogador"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Por status</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIBRARY_STATUSES.map((status) => (
            <li
              key={status}
              className="retro-panel retro-card flex items-center justify-between rounded-xl px-4 py-3"
            >
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${LIBRARY_STATUS_BADGE_CLASSES[status]}`}
              >
                {LIBRARY_STATUS_LABELS[status]}
              </span>
              <span className="text-xl font-semibold tabular-nums">
                {stats.byStatus[status].toLocaleString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function SummaryHeader({ username }: { username: string }) {
  return (
    <header>
      <p className="retro-kicker">Player stats // Public data</p>
      <h1 className="retro-title mt-1 text-2xl font-semibold">
        Resumo de @{username}
      </h1>
      <p className="mt-1 text-sm text-zinc-700">
        Uma visão geral da biblioteca e das avaliações deste jogador.
      </p>
    </header>
  );
}
