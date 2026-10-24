interface SpinnerProps {
  label?: string;
}

const LOADING_BLOCKS = 6;

export function Spinner({ label = 'Carregando…' }: SpinnerProps) {
  return (
    <span
      role="status"
      className="inline-flex flex-col items-center gap-2 text-zinc-300"
    >
      <span aria-hidden="true" className="flex items-center gap-2">
        <span className="retro-loading-cursor text-xl leading-none text-brand-500">
          ▶
        </span>
        <span className="flex gap-1 border border-zinc-600 bg-black/50 p-1 shadow-[3px_3px_0_rgba(0,0,0,0.65)]">
          {Array.from({ length: LOADING_BLOCKS }, (_, index) => (
            <span
              key={index}
              className="retro-loading-block h-3 w-5 border border-zinc-600 bg-zinc-800"
              style={{ animationDelay: `${index * 140}ms` }}
            />
          ))}
        </span>
      </span>
      <span className="retro-loading-label text-xs font-bold tracking-[0.16em] uppercase">
        {label}
      </span>
    </span>
  );
}
