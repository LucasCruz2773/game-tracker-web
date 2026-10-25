import { useParams, useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { inputClasses } from '../../../components/form-classes';
import { Pagination } from '../../../components/Pagination';
import { Spinner } from '../../../components/Spinner';
import { parseEnumParam, parsePageParam } from '../../../lib/search-params';
import {
  LIBRARY_SORT_LABELS,
  LIBRARY_STATUS_LABELS,
} from '../../library/library-labels';
import {
  LIBRARY_SORT_FIELDS,
  LIBRARY_STATUSES,
  type LibrarySortField,
  type LibraryStatus,
} from '../../library/library.types';
import { PublicLibraryCard } from '../components/PublicLibraryCard';
import { usePublicLibrary } from '../use-social';

const PAGE_SIZE = 12;
const DEFAULT_SORT: LibrarySortField = 'updatedAt';

export function PublicLibraryPage() {
  const { username = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseEnumParam(searchParams.get('status'), LIBRARY_STATUSES);
  const sortBy =
    parseEnumParam(searchParams.get('sort'), LIBRARY_SORT_FIELDS) ??
    DEFAULT_SORT;
  const page = parsePageParam(searchParams.get('page'));
  const library = usePublicLibrary(username, {
    status,
    sortBy,
    page,
    pageSize: PAGE_SIZE,
  });

  function updateParams(changes: {
    status?: LibraryStatus | undefined;
    sortBy?: LibrarySortField;
    page?: number;
  }) {
    const next = { status, sortBy, page: 1, ...changes };
    const params = new URLSearchParams();
    if (next.status) params.set('status', next.status);
    if (next.sortBy !== DEFAULT_SORT) params.set('sort', next.sortBy);
    if (next.page > 1) params.set('page', String(next.page));
    setSearchParams(params);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="retro-kicker">Memory card // Public saves</p>
          <h1 className="retro-title mt-1 text-2xl font-semibold">
            Biblioteca de @{username}
          </h1>
        </div>
        <div className="w-56">
          <label htmlFor="public-library-sort" className="sr-only">
            Ordenar por
          </label>
          <select
            id="public-library-sort"
            value={sortBy}
            onChange={(event) =>
              updateParams({
                sortBy: parseEnumParam(event.target.value, LIBRARY_SORT_FIELDS),
              })
            }
            className={inputClasses}
          >
            {LIBRARY_SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                {LIBRARY_SORT_LABELS[field]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <StatusFilter
        selected={status}
        onSelect={(nextStatus) => updateParams({ status: nextStatus })}
      />

      {library.isPending || library.isPlaceholderData ? (
        <div className="flex min-h-64 items-center justify-center py-16">
          <Spinner label="Carregando biblioteca…" />
        </div>
      ) : library.isError ? (
        <ErrorState
          title="Não foi possível carregar esta biblioteca"
          description="Verifique sua conexão e tente novamente."
          onRetry={() => void library.refetch()}
        />
      ) : library.data.items.length === 0 ? (
        <EmptyState
          title={
            status
              ? `Nenhum jogo em “${LIBRARY_STATUS_LABELS[status]}”`
              : 'Esta biblioteca está vazia'
          }
          description={
            status
              ? 'Este jogador não possui jogos com o status selecionado.'
              : 'Este jogador ainda não adicionou jogos à biblioteca.'
          }
        />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            {library.data.items.map((entry) => (
              <PublicLibraryCard key={entry.id} entry={entry} />
            ))}
          </ul>
          <Pagination
            page={library.data.page}
            pageSize={library.data.pageSize}
            total={library.data.total}
            disabled={library.isPlaceholderData}
            onPageChange={(nextPage) => updateParams({ page: nextPage })}
          />
        </>
      )}
    </section>
  );
}

interface StatusFilterProps {
  selected: LibraryStatus | undefined;
  onSelect: (status: LibraryStatus | undefined) => void;
}

function StatusFilter({ selected, onSelect }: StatusFilterProps) {
  const options: { value: LibraryStatus | undefined; label: string }[] = [
    { value: undefined, label: 'Todos' },
    ...LIBRARY_STATUSES.map((status) => ({
      value: status,
      label: LIBRARY_STATUS_LABELS[status],
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Filtrar biblioteca por status"
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const selectedOption = option.value === selected;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selectedOption}
            onClick={() => onSelect(option.value)}
            className={`rounded-lg border px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition focus-visible:outline-2 focus-visible:outline-brand-500 ${
              selectedOption
                ? 'theme-nav-active shadow-[2px_2px_0_rgba(0,0,0,0.8)]'
                : 'console-filter-button'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
