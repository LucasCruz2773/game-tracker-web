interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-zinc-400">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-violet-500"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
