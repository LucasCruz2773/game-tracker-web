interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const buttonClasses =
  'rounded-lg border border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-violet-500';

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-center gap-4"
    >
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        Anterior
      </button>
      <span className="text-sm text-zinc-400">
        Página {page} de {totalPages.toLocaleString('pt-BR')}
      </span>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Próxima
      </button>
    </nav>
  );
}
