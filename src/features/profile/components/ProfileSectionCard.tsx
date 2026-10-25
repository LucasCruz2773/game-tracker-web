import { Link } from 'react-router';

interface ProfileSectionCardProps {
  to: string;
  symbol: string;
  title: string;
  description: string;
  action: string;
  symbolClassName: string;
}

export function ProfileSectionCard({
  to,
  symbol,
  title,
  description,
  action,
  symbolClassName,
}: ProfileSectionCardProps) {
  return (
    <Link
      to={to}
      className="retro-panel retro-card group flex min-h-52 flex-col p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
    >
      <span
        aria-hidden="true"
        className={`text-4xl leading-none ${symbolClassName}`}
      >
        {symbol}
      </span>
      <h2 className="retro-title mt-4 text-lg font-bold">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-700">
        {description}
      </p>
      <span className="mt-5 text-xs font-bold tracking-[0.14em] text-brand-600 uppercase group-hover:text-brand-500">
        {action} <span aria-hidden="true">›</span>
      </span>
      <div className="memory-card-caption mt-4 flex justify-between border px-2 py-1 text-[0.6rem] tracking-[0.15em] uppercase">
        <span>Profile data</span>
        <span>Open</span>
      </div>
    </Link>
  );
}
