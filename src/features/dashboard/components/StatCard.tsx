interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="retro-panel retro-card rounded-xl p-5">
      <p className="font-mono text-xs tracking-wider text-zinc-400 uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tabular-nums text-white drop-shadow-[2px_2px_0_#850015]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </article>
  );
}
