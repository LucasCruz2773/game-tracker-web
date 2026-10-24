import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="retro-panel retro-grid flex flex-col items-center gap-2 rounded-xl border-dashed px-6 py-12 text-center">
      <p aria-hidden="true" className="retro-kicker">
        No data // 00
      </p>
      <h2 className="retro-title font-semibold">{title}</h2>
      {description && <p className="text-sm text-zinc-700">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
