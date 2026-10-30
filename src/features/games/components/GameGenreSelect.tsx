import { inputClasses } from '../../../components/form-classes';
import { useI18n, type Language } from '../../../i18n/i18n';
import { GAME_GENRES, type GameGenre } from '../games.types';

const LABELS: Record<GameGenre, Record<Language, string>> = {
  action: { pt: 'Ação', en: 'Action', es: 'Acción' },
  indie: { pt: 'Indie', en: 'Indie', es: 'Indie' },
  adventure: { pt: 'Aventura', en: 'Adventure', es: 'Aventura' },
  'role-playing-games-rpg': { pt: 'RPG', en: 'RPG', es: 'RPG' },
  strategy: { pt: 'Estratégia', en: 'Strategy', es: 'Estrategia' },
  shooter: { pt: 'Tiro', en: 'Shooter', es: 'Disparos' },
  casual: { pt: 'Casual', en: 'Casual', es: 'Casual' },
  simulation: { pt: 'Simulação', en: 'Simulation', es: 'Simulación' },
  puzzle: { pt: 'Quebra-cabeça', en: 'Puzzle', es: 'Puzle' },
  arcade: { pt: 'Arcade', en: 'Arcade', es: 'Arcade' },
  platformer: { pt: 'Plataforma', en: 'Platformer', es: 'Plataformas' },
  racing: { pt: 'Corrida', en: 'Racing', es: 'Carreras' },
  sports: { pt: 'Esportes', en: 'Sports', es: 'Deportes' },
  fighting: { pt: 'Luta', en: 'Fighting', es: 'Lucha' },
  'massively-multiplayer': { pt: 'MMO', en: 'MMO', es: 'MMO' },
  family: { pt: 'Família', en: 'Family', es: 'Familiar' },
  'board-games': { pt: 'Tabuleiro', en: 'Board Games', es: 'Juegos de mesa' },
  educational: { pt: 'Educacional', en: 'Educational', es: 'Educativo' },
  card: { pt: 'Cartas', en: 'Card', es: 'Cartas' },
};

export function GameGenreSelect({
  value,
  onChange,
}: {
  value?: GameGenre;
  onChange: (genre?: GameGenre) => void;
}) {
  const { language, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-zinc-300 uppercase">
      <span className="shrink-0">{t('genre')}</span>
      <select
        value={value ?? ''}
        onChange={(event) =>
          onChange((event.target.value || undefined) as GameGenre | undefined)
        }
        className={`${inputClasses} min-w-0 sm:w-auto`}
      >
        <option value="">{t('allGenres')}</option>
        {GAME_GENRES.map((genre) => (
          <option key={genre} value={genre}>
            {LABELS[genre][language]}
          </option>
        ))}
      </select>
    </label>
  );
}
