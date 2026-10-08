import { Link } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { Spinner } from '../../../components/Spinner';
import {
  LIBRARY_STATUS_BADGE_CLASSES,
  LIBRARY_STATUS_LABELS,
} from '../../library/library-labels';
import { LIBRARY_STATUSES } from '../../library/library.types';
import { formatStarRating } from '../../reviews/rating';
import { StatCard } from '../components/StatCard';
import { useDashboardStats } from '../use-dashboard-stats';

export function DashboardPage() {
  const { data: stats, isPending, isError, refetch } = useDashboardStats();

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Carregando resumo…" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar seu resumo"
        description="Verifique sua conexão e tente novamente."
        onRetry={() => void refetch()}
      />
    );
  }

  if (stats.totalGames === 0) {
    return (
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Resumo</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Uma visão geral da sua biblioteca e das suas avaliações.
          </p>
        </header>
        <EmptyState
          title="Nada para resumir ainda"
          description="Adicione jogos à sua biblioteca para ver estatísticas aqui."
          action={
            <Link
              to="/"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500"
            >
              Explorar jogos
            </Link>
          }
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
      <header>
        <h1 className="text-2xl font-semibold">Resumo</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Uma visão geral da sua biblioteca e das suas avaliações.
        </p>
      </header>

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
          label="Nota média"
          value={averageStars}
          hint="Das suas avaliações"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Por status</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIBRARY_STATUSES.map((status) => (
            <li
              key={status}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"
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
