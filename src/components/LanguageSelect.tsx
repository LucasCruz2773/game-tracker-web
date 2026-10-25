import { useI18n, type Language } from '../i18n/i18n';

export function LanguageSelect() {
  const { language, setLanguage, t } = useI18n();
  return (
    <label className="inline-flex shrink-0 items-center">
      <span className="sr-only">{t('language')}</span>
      <select
        aria-label={t('language')}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="console-input h-10 cursor-pointer rounded-lg border px-2 text-xs font-bold uppercase focus-visible:outline-2"
      >
        <option value="pt">PT</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
