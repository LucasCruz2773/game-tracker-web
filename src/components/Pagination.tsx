interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const buttonClasses =
  'console-page-button rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wide uppercase disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2';

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
      <span className="font-mono text-xs font-bold text-zinc-700 uppercase">
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
