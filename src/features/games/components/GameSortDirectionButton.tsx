import { secondaryButtonClasses } from '../../../components/form-classes';
import { useI18n } from '../../../i18n/i18n';
import type { GameOrdering, GameSortDirection } from '../games.types';

export function GameSortDirectionButton({
  ordering,
  direction,
  onChange,
}: {
  ordering: GameOrdering;
  direction: GameSortDirection;
  onChange: (direction: GameSortDirection) => void;
}) {
  const { t } = useI18n();
  const disabled = ordering === 'relevance';
  const label = disabled
    ? t('relevanceDirectionUnavailable')
    : t(direction === 'asc' ? 'sortAscending' : 'sortDescending');

  return (
    <button
      type="button"
      disabled={disabled}
      title={label}
      aria-label={label}
      onClick={() => onChange(direction === 'asc' ? 'desc' : 'asc')}
      className={`${secondaryButtonClasses} inline-flex h-10 items-center gap-2 whitespace-nowrap`}
    >
      <span aria-hidden="true" className="text-base">
        {direction === 'asc' ? '↑' : '↓'}
      </span>
      {t(direction === 'asc' ? 'ascending' : 'descending')}
    </button>
  );
}
