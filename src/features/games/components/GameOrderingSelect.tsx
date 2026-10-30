import { inputClasses } from '../../../components/form-classes';
import { useI18n, type TranslationKey } from '../../../i18n/i18n';
import { GAME_ORDERINGS, type GameOrdering } from '../games.types';

const LABEL_KEYS: Record<GameOrdering, TranslationKey> = {
  relevance: 'sortRelevance',
  popularity: 'sortPopularity',
  rating: 'sortAverageRating',
  name: 'sortName',
  released: 'sortReleaseDate',
};

export function GameOrderingSelect({
  value,
  onChange,
}: {
  value: GameOrdering;
  onChange: (ordering: GameOrdering) => void;
}) {
  const { t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-zinc-300 uppercase">
      <span className="shrink-0">{t('sortBy')}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as GameOrdering)}
        className={`${inputClasses} min-w-0 sm:w-auto`}
      >
        {GAME_ORDERINGS.map((ordering) => (
          <option key={ordering} value={ordering}>
            {t(LABEL_KEYS[ordering])}
          </option>
        ))}
      </select>
    </label>
  );
}
