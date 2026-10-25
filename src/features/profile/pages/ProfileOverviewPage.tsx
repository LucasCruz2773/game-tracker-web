import { ProfileSectionCard } from '../components/ProfileSectionCard';

const PROFILE_SECTIONS = [
  {
    to: 'library',
    symbol: '□',
    title: 'Minha biblioteca',
    description:
      'Veja seus jogos, filtre por status e atualize seu progresso e suas notas.',
    action: 'Abrir biblioteca',
    symbolClassName: 'text-fuchsia-500',
  },
  {
    to: 'summary',
    symbol: '○',
    title: 'Resumo',
    description:
      'Consulte totais, horas jogadas, média de avaliações e jogos por status.',
    action: 'Ver estatísticas',
    symbolClassName: 'text-brand-500',
  },
  {
    to: 'integrations',
    symbol: '×',
    title: 'Integrações',
    description:
      'Conecte sua conta Steam, sincronize horas e importe jogos para o GameTrack.',
    action: 'Gerenciar conexões',
    symbolClassName: 'text-blue-500',
  },
] as const;

export function ProfileOverviewPage() {
  return (
    <section>
      <p className="retro-kicker">Select file // Player options</p>
      <h1 className="retro-title mt-1 text-2xl font-semibold">
        Área do jogador
      </h1>
      <p className="mt-2 text-sm text-zinc-700">
        Acesse sua coleção, estatísticas e contas conectadas.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PROFILE_SECTIONS.map((section) => (
          <ProfileSectionCard key={section.to} {...section} />
        ))}
      </div>
    </section>
  );
}
