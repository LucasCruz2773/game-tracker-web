interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Carregando…' }: SpinnerProps) {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-3 text-zinc-400"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500"
      />
      <span className="text-sm">{label}</span>
    </span>
  );
}
