interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="retro-panel mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl p-8 text-center"
    >
      <p className="retro-kicker">System error</p>
      <h2 className="retro-title text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-zinc-700">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="theme-primary-button mt-2 rounded-lg border px-4 py-2 text-sm font-bold tracking-wide uppercase shadow-[3px_3px_0_rgba(70,70,76,0.55)] focus-visible:outline-2"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
